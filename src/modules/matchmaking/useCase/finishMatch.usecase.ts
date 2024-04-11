import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/index';

import { ResolveMatchResults } from './resolveMatchResults.usecase';
import { TransactionRunner } from '../../../shared/util';
import { PublishUserMetaChanged } from '../../gateway/usecase/publishUserMetaChanged.usecase';
import { PublishMathBattleResultsChanged } from '../../gateway/usecase/pushMathBattleResultsChanged.usecase';
import { MathBattleResultMutationService } from '../../mathBattleResult/mathBattleResultMutation.service';
import { MathBattleResultQueryService } from '../../mathBattleResult/mathBattleResultQuery.service';
import { UserMetaMutationService } from '../../userMeta/userMetaMutation.service';
import { UserMetaQueryService } from '../../userMeta/userMetaQuery.service';
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
    private readonly userMetaMutationService: UserMetaMutationService,
    private readonly userMetaQueryService: UserMetaQueryService,
    private readonly publishUserMetaChanged: PublishUserMetaChanged,
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
        ...newGameResultValues.map((newGameResult) =>
          this.userMetaMutationService.addTrophies({
            userId: newGameResult.userId,
            amount: newGameResult.trophyChange ?? 0,
            txProvider,
          }),
        ),
      ]);
    });

    const [mathBattleResults, userMetas] = await Promise.all([
      this.mathBattleResultQueryService.getAllByMatchId(match.id),
      this.userMetaQueryService.getByUserIds(match.userIds),
    ]);

    const trophyChangeParams = userMetas.map((userMeta) => {
      const gameResult = mathBattleResults.find(
        (result) => result.userId === userMeta.userId,
      );

      return {
        userId: userMeta.userId,
        payload: {
          userMeta,
          userMetaChange: {
            trophyChange: gameResult?.trophyChange ?? 0,
            matchId: match.id,
          },
        },
      };
    });

    await Promise.all([
      this.publishMathBattleResultsChanged.call({
        userIds: match.userIds,
        results: mathBattleResults,
      }),
      ...trophyChangeParams.map((params) =>
        this.publishUserMetaChanged.call(params),
      ),
    ]);
  }
}
