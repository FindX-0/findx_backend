import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/entityEnums';
import { TransactionProvider } from '@shared/util';

import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class FinishMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async call(matchId: string, txProvider: TransactionProvider): Promise<void> {
    await this.matchRepository.updateStateById(
      matchId,
      MatchState.FINISHED,
      txProvider.get(),
    );
  }
}
