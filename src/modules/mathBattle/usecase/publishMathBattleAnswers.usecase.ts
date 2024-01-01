import { Injectable } from '@nestjs/common';

import { PublishMathBattleScoreChanged } from '@modules/gateway/usecase/publishMathBattleScoreChanged.usecase';
import { SelectableMatch } from '@modules/matchmaking/entity/match.entity';
import { groupByToMap } from '@shared/util';

import { MathBattleUserScoreDto } from '../dto/mathBattleScoreChanged.dto';
import { MathBattleAnswerQueryService } from '../mathBattleAnswer/mathBattleAnswerQuery.service';

type Args = {
  match: SelectableMatch;
};

@Injectable()
export class PublishMathBattleAnswers {
  constructor(
    private readonly mathBattleAnswerQueryService: MathBattleAnswerQueryService,
    private readonly publishMathBattleScoreChanged: PublishMathBattleScoreChanged,
  ) {}

  async call({ match }: Args) {
    const mathBattleAnswers =
      await this.mathBattleAnswerQueryService.getAllByMatchId(match.id);

    const scores: MathBattleUserScoreDto[] = Array.from(
      groupByToMap(mathBattleAnswers, (e) => e.userId),
    ).map(([userId, groupedAnswers]) => {
      return {
        userId,
        score: groupedAnswers.filter((e) => e.isCorrect).length,
      };
    });

    await this.publishMathBattleScoreChanged.call({
      userIds: match.userIds,
      payload: { matchId: match.id, scores: scores },
    });
  }
}
