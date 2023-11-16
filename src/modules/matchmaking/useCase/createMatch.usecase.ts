import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/entityEnums';
import { SelectableMatch } from '@entities/match.entiry';
import { TransactionProvider } from '@shared/util';

import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class CreateMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async call({
    mathFieldId,
    txProvider,
  }: {
    mathFieldId: string;
    txProvider?: TransactionProvider;
  }): Promise<SelectableMatch> {
    return this.matchRepository.create(
      {
        state: MatchState.PENDING,
        mathFieldId,
      },
      txProvider?.get(),
    );
  }
}
