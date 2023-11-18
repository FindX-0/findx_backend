import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/entityEnums';
import { NewMatch, SelectableMatch } from '@entities/match.entity';
import { TransactionProvider } from '@shared/util';

import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class CreateMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async call(
    match: Omit<NewMatch, 'id' | 'state'>,
    txProvider?: TransactionProvider,
  ): Promise<SelectableMatch | null> {
    return this.matchRepository.create(
      {
        state: MatchState.PENDING,
        ...match,
      },
      txProvider?.get(),
    );
  }
}
