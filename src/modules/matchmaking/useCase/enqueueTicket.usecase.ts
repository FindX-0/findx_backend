import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { TicketState } from '@entities/index';
import { TransactionRunner } from '@shared/util/transactionRunner';

import { ExceptionMessageCode } from '../../../shared/constant';
import { uuidV4 } from '../../../shared/util/random';
import { SelectableTicket } from '../entity/ticket.entity';
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

  async call({
    userId,
    mathFieldId,
  }: EnqueueTicketParams): Promise<SelectableTicket> {
    return this.transactionRunner.runTransaction(async (txProvider) => {
      await this.ticketRepository.updateAllProcessing(
        {
          userId,
          payload: {
            state: TicketState.CANCELLED,
            concurrencyTimestamp: uuidV4(),
          },
        },
        txProvider,
      );

      const ticket = await this.ticketRepository.create(
        {
          matchId: null,
          mathFieldId,
          userId,
          state: TicketState.PROCESSING,
          concurrencyTimestamp: uuidV4(),
        },
        txProvider,
      );

      if (!ticket) {
        throw new InternalServerErrorException(
          ExceptionMessageCode.TICKET_ENQUEUE_FAILED,
        );
      }

      return ticket;
    });
  }
}
