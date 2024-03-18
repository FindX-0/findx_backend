import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/index';

import { AfterUserMatchDraw } from './afterUserMatchDraw.usecase';
import { AfterUserMatchLose } from './afterUserMatchLose.usecase';
import { AfterUserMatchWin } from './afterUserMatchWin.usecase';
import { ResolveMatchResults } from './resolveMatchResults.usecase';
import { TransactionRunner } from '../../../shared/util';
import { PublishMathBattleResultsChanged } from '../../gateway/usecase/pushMathBattleResultsChanged.usecase';
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
    private readonly resolveMatchResults: ResolveMatchResults,
    private readonly publishMathBattleResultsChanged: PublishMathBattleResultsChanged,
    private readonly afterUserMatchWin: AfterUserMatchWin,
    private readonly afterUserMatchDraw: AfterUserMatchDraw,
    private readonly afterUserMatchLose: AfterUserMatchLose,
  ) {}

  async call(match: SelectableMatch): Promise<void> {
    await this.transactionRunner.runTransaction(async (txProvider) => {
      const newGameResultValues = await this.resolveMatchResults.call(match);

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

    await this.transactionRunner.runTransaction(async (txProvider) => {
      const afterUserMatchResultPromises = results.map((result) => {
        if (result.isDraw) {
          return this.afterUserMatchDraw.call({
            userId: result.userId,
            match,
            txProvider,
          });
        }

        if (result.isWinner) {
          return this.afterUserMatchWin.call({
            userId: result.userId,
            match,
            txProvider,
          });
        }

        return this.afterUserMatchLose.call({
          userId: result.userId,
          match,
          txProvider,
        });
      });

      return Promise.all(afterUserMatchResultPromises);
    });

    await this.publishMathBattleResultsChanged.call({
      userIds: match.userIds,
      results,
    });
  }
}
