import { Injectable } from '@nestjs/common';

import { TransactionProvider } from '../../../shared/util';
import { UserMetaMutationService } from '../../user/userMeta/userMetaMutation.service';
import { SelectableMatch } from '../entity/match.entity';

type Args = {
  userId: string;
  match: SelectableMatch;
  txProvider: TransactionProvider;
};

@Injectable()
export class AfterUserMatchWin {
  constructor(
    private readonly userMetaMutationService: UserMetaMutationService,
  ) {}

  async call({ userId, txProvider }: Args): Promise<void> {
    await this.userMetaMutationService.addTrophies({
      userId,
      amount: 10,
      txProvider,
    });
  }
}
