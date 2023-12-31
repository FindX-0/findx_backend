import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { MatchQueryService } from '@modules/matchmaking/service/matchQuery.service';
import { ExceptionMessageCode } from '@shared/constant';

import { PublishMathBattleAnswers } from './publishMathBattleAnswers.usecase';
import { MatchState } from '../../../entities';
import { MathProblemQueryService } from '../../mathProblem/mathProblemQuery.service';
import { MathBattleAnswerMutationService } from '../mathBattleAnswerMutation.service';

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
    private readonly matchQueryService: MatchQueryService,
    private readonly mathBattleAnswerMutationService: MathBattleAnswerMutationService,
    private readonly publishMathBattleAnswers: PublishMathBattleAnswers,
  ) {}

  async call({ userId, matchId, mathProblemId, answer }: Args) {
    const match = await this.matchQueryService.getById(matchId, {
      validateUserIncluded: { userId },
    });

    if (match.state !== MatchState.IN_PROGRESS) {
      throw new BadRequestException(ExceptionMessageCode.INVALID_MATCH_STATE);
    }

    if (!match.mathProblemIds.includes(mathProblemId)) {
      throw new BadRequestException(
        ExceptionMessageCode.INVALID_MATH_PROBLEM_ID,
      );
    }

    const mathProblem =
      await this.mathProblemQueryService.getById(mathProblemId);

    const correctMathProblemAnswer = mathProblem.answers.find(
      (e) => e.isCorrect,
    );

    if (!correctMathProblemAnswer) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.CORRECT_MATH_PROBLEM_ANSWER_NOT_FOUND,
      );
    }

    await this.mathBattleAnswerMutationService.create({
      isCorrect: answer === correctMathProblemAnswer.tex,
      matchId,
      mathProblemId,
      userId,
    });

    await this.publishMathBattleAnswers.call({ match });
  }
}
