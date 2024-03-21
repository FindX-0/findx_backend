import { Injectable } from '@nestjs/common';

import { CalculateTrophyChange } from './calculateTrophyChange.usecase';
import { MatchResultOutcome } from '../../../shared/type/matchResultOutcome';
import { TransactionProvider } from '../../../shared/util';
import { UserMetaMutationService } from '../../user/userMeta/userMetaMutation.service';
import { SelectableMatch } from '../entity/match.entity';

type Args = {
  userId: string;
  match: SelectableMatch;
  txProvider: TransactionProvider;
};

@Injectable()
export class AfterUserMatchLose {
  constructor(
    private readonly userMetaMutationService: UserMetaMutationService,
    private readonly calculateTrophyChange: CalculateTrophyChange,
  ) {}

  async call({ userId, match, txProvider }: Args): Promise<void> {
    const trophyChange = await this.calculateTrophyChange.call({
      userId,
      match,
      matchResultOutcome: MatchResultOutcome.LOSE,
    });

    await this.userMetaMutationService.addTrophies({
      userId,
      amount: trophyChange,
      txProvider,
    });
  }
}
