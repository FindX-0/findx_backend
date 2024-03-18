import { Injectable } from '@nestjs/common';

import {
  CalculateMathMattleScore,
  MathBattleUserScore,
} from '../../mathBattleAnswer/usecase/calculateMatbBattleScore.usecase';
import { NewMathBattleResult } from '../../mathBattleResult/mathBattleResult.entity';
import { SelectableMatch } from '../entity/match.entity';

@Injectable()
export class ResolveMatchResults {
  constructor(
    private readonly calculateMathMattleScore: CalculateMathMattleScore,
  ) {}

  async call(match: SelectableMatch): Promise<NewMathBattleResult[]> {
    const userScores = await this.calculateMathMattleScore.call(match);

    if (userScores.length === 0) {
      return this.drawResults(match, { score: 0 });
    }

    const firstUserScore = userScores[0] as MathBattleUserScore;
    const isDraw = userScores.every((e) => e.score === firstUserScore.score);
    if (isDraw) {
      return this.drawResults(match, { score: firstUserScore.score });
    }

    const highestScore = Math.max.apply(
      null,
      userScores.map((e) => e.score),
    );

    return userScores.map((userScore) => ({
      ...userScore,
      matchId: match.id,
      isWinner: userScore.score === highestScore,
      isDraw: false,
    }));
  }

  private drawResults(
    match: SelectableMatch,
    { score }: { score: number },
  ): NewMathBattleResult[] {
    return match.userIds.map((userId) => ({
      userId,
      isWinner: false,
      isDraw: true,
      matchId: match.id,
      score,
    }));
  }
}
