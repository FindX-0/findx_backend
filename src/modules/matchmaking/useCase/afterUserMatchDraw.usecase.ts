import { Injectable } from '@nestjs/common';

import { TransactionProvider } from '../../../shared/util';
import { SelectableMatch } from '../entity/match.entity';

type Args = {
  userId: string;
  match: SelectableMatch;
  txProvider: TransactionProvider;
};

@Injectable()
export class AfterUserMatchDraw {
  async call({ userId, match, txProvider }: Args): Promise<void> {
    console.log(
      'AfterUserMatchDraw, userId:',
      userId,
      'match:',
      match,
      'txProvider:',
      txProvider,
    );
  }
}
