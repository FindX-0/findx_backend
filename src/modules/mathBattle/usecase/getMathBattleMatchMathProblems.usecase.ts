import { Injectable } from '@nestjs/common';

import { shuffleArray } from '../../../shared/util';
import { MatchQueryService } from '../../matchmaking/service/matchQuery.service';
import {
  MathProblemAnswerWoutCorrect,
  SelectableMathBattleMathProblemWRelations as SelectableMathProblemWoutAnswerCorrect,
} from '../../mathProblem/mathProblem.entity';
import { MathProblemQueryService } from '../../mathProblem/mathProblemQuery.service';
import { MediaFileQueryService } from '../../mediaFile/mediaFileQuery.service';

@Injectable()
export class GetMathBattleMatchMathProblems {
  constructor(
    private readonly mathProblemQueryService: MathProblemQueryService,
    private readonly matchQueryService: MatchQueryService,
    private readonly mediaFileQueryService: MediaFileQueryService,
  ) {}

  async call(
    matchId: string,
  ): Promise<SelectableMathProblemWoutAnswerCorrect[]> {
    const mathProblemIds =
      await this.matchQueryService.getMathProblemIdsById(matchId);

    const mathProblems =
      await this.mathProblemQueryService.getByIds(mathProblemIds);

    const imageMediaIds = mathProblems.map((e) => e.imageMediaIds).flat(1);

    const imageMediaFiles =
      await this.mediaFileQueryService.getByIds(imageMediaIds);

    return mathProblems.map((mathProblem) => {
      const images = imageMediaFiles.filter(
        (mediaFile) => mathProblem.imageMediaIds?.includes(mediaFile.id),
      );

      const answersWoutIsCorrect: MathProblemAnswerWoutCorrect[] =
        mathProblem.answers.map((answer) => ({ tex: answer.tex }));

      return {
        ...mathProblem,
        answers: shuffleArray(answersWoutIsCorrect),
        images,
      };
    });
  }
}
