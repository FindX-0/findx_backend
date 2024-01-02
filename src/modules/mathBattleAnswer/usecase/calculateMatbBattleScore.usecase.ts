import { Injectable } from '@nestjs/common';

import { groupByToMap } from '../../../shared/util';
import { SelectableMatch } from '../../matchmaking/entity/match.entity';
import { MathBattleAnswerQueryService } from '../mathBattleAnswerQuery.service';

export type MathBattleUserScore = {
  userId: string;
  score: number;
};

@Injectable()
export class CalculateMathMattleScore {
  constructor(
    private readonly mathBattleAnswerQueryService: MathBattleAnswerQueryService,
  ) {}

  async call(match: SelectableMatch): Promise<MathBattleUserScore[]> {
    const mathBattleAnswers =
      await this.mathBattleAnswerQueryService.getAllByMatchId(match.id);

    const scores = Array.from(
      groupByToMap(mathBattleAnswers, (e) => e.userId),
    ).map(([userId, groupedAnswers]) => {
      return {
        userId,
        score: groupedAnswers.filter((e) => e.isCorrect).length,
      };
    });

    // case when some users didn't leave an answer in a match
    const resolvedScoreUserIds = scores.map((e) => e.userId);

    const absentUserScores = match.userIds
      .filter((e) => !resolvedScoreUserIds.includes(e))
      .map((e) => ({ userId: e, score: 0 }));

    return scores.concat(absentUserScores);
  }
}
