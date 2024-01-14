import { Injectable } from '@nestjs/common';

import { PublishMathBattleScoreChanged } from '@modules/gateway/usecase/publishMathBattleScoreChanged.usecase';
import { SelectableMatch } from '@modules/matchmaking/entity/match.entity';

import { CalculateMathMattleScore } from '../../mathBattleAnswer/usecase/calculateMatbBattleScore.usecase';

type Args = {
  match: SelectableMatch;
};

@Injectable()
export class PublishMathBattleAnswers {
  constructor(
    private readonly publishMathBattleScoreChanged: PublishMathBattleScoreChanged,
    private readonly calculateMathMattleScore: CalculateMathMattleScore,
  ) {}

  async call({ match }: Args) {
    const scores = await this.calculateMathMattleScore.call(match);

    await this.publishMathBattleScoreChanged.call({
      userIds: match.userIds,
      payload: { matchId: match.id, scores: scores },
    });
  }
}
