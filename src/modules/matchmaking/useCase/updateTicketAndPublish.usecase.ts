import { Injectable, NotFoundException } from '@nestjs/common';

import { Ticket } from '@entities/entityTypes';
import { PublishTicketChangedUsecase } from '@modules/gateway';
import { ExceptionMessageCode } from '@shared/constant';
import { TransactionProvider } from '@shared/util';

import { TicketUpdate } from '../entity';
import { TicketRepository } from '../repository/ticket.repository';

@Injectable()
export class UpdateTicketAndPublishUsecase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly publishTicketChangedUsecase: PublishTicketChangedUsecase,
  ) {}

  async call({
    ticketId,
    payload,
    txProvider,
  }: {
    ticketId: string;
    payload: TicketUpdate;
    txProvider: TransactionProvider;
  }): Promise<void> {
    const newTicket = await this.ticketRepository.updateById(
      ticketId,
      payload,
      txProvider.get(),
    );

    if (!newTicket) {
      throw new NotFoundException(ExceptionMessageCode.TICKET_NOT_FOUND);
    }

    await this.publishTicketChangedUsecase.call({
      userId: newTicket.userId,
      ticket: newTicket,
    });
  }
}
