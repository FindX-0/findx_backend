import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TicketState } from '../../../entities';
import { ExceptionMessageCode } from '../../../shared/constant';
import { TransactionRunner } from '../../../shared/util';
import { TicketRepository } from '../repository/ticket.repository';

@Injectable()
export class CancelTicket {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly txRunner: TransactionRunner,
  ) {}

  async call({
    userId,
    ticketId,
    concurrencyTimestamp,
  }: {
    userId: string;
    ticketId: string;
    concurrencyTimestamp: string;
  }): Promise<void> {
    return this.txRunner.runTransaction(async (txProvider) => {
      const ticket = await this.ticketRepository.getById(ticketId, txProvider);

      if (!ticket || ticket.userId !== userId) {
        throw new NotFoundException(ExceptionMessageCode.TICKET_NOT_FOUND);
      }

      if (ticket.concurrencyTimestamp != concurrencyTimestamp) {
        throw new BadRequestException(ExceptionMessageCode.TICKET_CONCURRENCY);
      }

      await this.ticketRepository.updateById(
        ticketId,
        {
          state: TicketState.CANCELLED,
          concurrencyTimestamp,
        },
        txProvider,
      );
    });
  }
}
