import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Decimal } from 'decimal.js';

import { MatchQueryService } from '@modules/matchmaking/service/matchQuery.service';
import { ExceptionMessageCode } from '@shared/constant';

import { PublishMathBattleAnswers } from './publishMathBattleAnswers.usecase';
import { MatchState } from '../../../entities';
import { MathBattleAnswerMutationService } from '../../mathBattleAnswer/mathBattleAnswerMutation.service';
import { MathBattleAnswerQueryService } from '../../mathBattleAnswer/mathBattleAnswerQuery.service';
import { MathProblemMutationService } from '../../mathProblem/mathProblemMutation.service';
import { MathProblemQueryService } from '../../mathProblem/mathProblemQuery.service';
import { CalculateMathProblemDifficulty } from '../../mathProblem/usecase/calculateMathProblemDifficulty';

type Args = {
  matchId: string;
  mathProblemId: string;
  answer: string;
  userId: string;
};

@Injectable()
export class SubmitMathProblemAnswer {
  constructor(
    private readonly mathProblemQueryService: MathProblemQueryService,
    private readonly mathProblemMutationService: MathProblemMutationService,
    private readonly matchQueryService: MatchQueryService,
    private readonly mathBattleAnswerMutationService: MathBattleAnswerMutationService,
    private readonly mathBattleAnswerQueryService: MathBattleAnswerQueryService,
    private readonly publishMathBattleAnswers: PublishMathBattleAnswers,
    private readonly calculateMathProblemDifficulty: CalculateMathProblemDifficulty,
  ) {}

  async call({ userId, matchId, mathProblemId, answer }: Args) {
    const [match, lastAnswer, mathProblem] = await Promise.all([
      this.matchQueryService.getById(matchId, {
        validateUserIncluded: { userId },
      }),
      this.mathBattleAnswerQueryService.getLastByMatchIdAndUserId(
        matchId,
        userId,
      ),
      this.mathProblemQueryService.getById(mathProblemId),
    ]);

    if (match.state !== MatchState.IN_PROGRESS) {
      throw new BadRequestException(ExceptionMessageCode.INVALID_MATCH_STATE);
    }

    if (!match.mathProblemIds.includes(mathProblemId)) {
      throw new BadRequestException(
        ExceptionMessageCode.INVALID_MATH_PROBLEM_ID,
      );
    }

    const correctMathProblemAnswer = mathProblem.answers.find(
      (e) => e.isCorrect,
    );

    if (!correctMathProblemAnswer) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.CORRECT_MATH_PROBLEM_ANSWER_NOT_FOUND,
      );
    }

    const isAnswerCorrect = answer === correctMathProblemAnswer.tex;

    const timeSpentInMillis = lastAnswer
      ? Date.now() - lastAnswer.createdAt.getTime()
      : Date.now() - match.startAt.getTime();

    await this.mathBattleAnswerMutationService.create({
      isCorrect: isAnswerCorrect,
      matchId,
      mathProblemId,
      userId,
      timeSpentInMillis,
    });

    const meanTimeSpentInMillis =
      (mathProblem.meanTimeSpentInMillis * mathProblem.timesAnswered +
        timeSpentInMillis) /
      (mathProblem.timesAnswered + 1);

    const newDifficulty = this.calculateMathProblemDifficulty.calculate({
      currentDifficulty: new Decimal(mathProblem.difficulty),
      timeSpentInMillis,
      meanTimeSpentInMillis,
      isCorrect: isAnswerCorrect,
    });

    await Promise.all([
      this.mathProblemMutationService.updateById(mathProblemId, {
        difficulty: newDifficulty.toNumber(),
        timesAnswered: mathProblem.timesAnswered + 1,
        meanTimeSpentInMillis,
      }),
      this.publishMathBattleAnswers.call({ match }),
    ]);
  }
}
