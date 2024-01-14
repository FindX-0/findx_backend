import { Injectable } from '@nestjs/common';

import { TicketState } from '@entities/index';
import { TransactionRunner } from '@shared/util/transactionRunner';

import { TicketRepository } from '../repository/ticket.repository';

type EnqueueTicketParams = {
  userId: string;
  mathFieldId: string;
};

@Injectable()
export class EnqueueTicket {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async call({ userId, mathFieldId }: EnqueueTicketParams) {
    await this.transactionRunner.runTransaction(async (txProvider) => {
      await this.ticketRepository.updateAllProcessing(
        {
          userId,
          payload: {
            state: TicketState.CANCELLED,
          },
        },
        txProvider,
      );

      await this.ticketRepository.create(
        {
          matchId: null,
          mathFieldId,
          userId,
          state: TicketState.PROCESSING,
        },
        txProvider,
      );
    });
  }
}
