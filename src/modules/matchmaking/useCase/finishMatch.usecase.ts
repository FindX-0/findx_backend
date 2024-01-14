import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/index';

import { TransactionRunner } from '../../../shared/util';
import { PublishMathBattleResultsChanged } from '../../gateway/usecase/pushMathBattleResultsChanged.usecase';
import {
  CalculateMathMattleScore,
  MathBattleUserScore,
} from '../../mathBattleAnswer/usecase/calculateMatbBattleScore.usecase';
import { NewMathBattleResult } from '../../mathBattleResult/mathBattleResult.entity';
import { MathBattleResultMutationService } from '../../mathBattleResult/mathBattleResultMutation.service';
import { MathBattleResultQueryService } from '../../mathBattleResult/mathBattleResultQuery.service';
import { SelectableMatch } from '../entity/match.entity';
import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class FinishMatch {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly mathBattleResultMutationService: MathBattleResultMutationService,
    private readonly mathBattleResultQueryService: MathBattleResultQueryService,
    private readonly transactionRunner: TransactionRunner,
    private readonly calculateMathMattleScore: CalculateMathMattleScore,
    private readonly publishMathBattleResultsChanged: PublishMathBattleResultsChanged,
  ) {}

  async call(match: SelectableMatch): Promise<void> {
    await this.transactionRunner.runTransaction(async (txProvider) => {
      const newGameResultValues = await this.resolveResults(match);

      return Promise.all([
        this.matchRepository.updateStateById(
          match.id,
          MatchState.FINISHED,
          txProvider,
        ),
        ...newGameResultValues.map((newGameResult) =>
          this.mathBattleResultMutationService.create(
            newGameResult,
            txProvider,
          ),
        ),
      ]);
    });

    const results = await this.mathBattleResultQueryService.getAllByMatchId(
      match.id,
    );

    await this.publishMathBattleResultsChanged.call({
      userIds: match.userIds,
      results,
    });
  }

  private async resolveResults(
    match: SelectableMatch,
  ): Promise<NewMathBattleResult[]> {
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
