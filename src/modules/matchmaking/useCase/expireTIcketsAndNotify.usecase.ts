import { Injectable } from '@nestjs/common';

import { TicketState } from '@entities/index';
import { PublishTicketChanged } from '@modules/gateway/usecase/publishTicketChanged.usecase';
import { TransactionProvider } from '@shared/util';

import { uuidV4 } from '../../../shared/util/random';
import { SelectableTicket } from '../entity/ticket.entity';
import { TicketRepository } from '../repository/ticket.repository';

@Injectable()
export class ExpireTicketsAndNotify {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly publishTicketChangedUsecase: PublishTicketChanged,
  ) {}

  async call({
    tickets,
    txProvider,
  }: {
    tickets: SelectableTicket[];
    txProvider: TransactionProvider;
  }): Promise<void> {
    await this.ticketRepository.updateAllByIds(
      tickets.map((e) => e.id),
      { state: TicketState.EXPIRED, concurrencyTimestamp: uuidV4() },
      txProvider,
    );

    const notifyPromises = tickets.map((ticket) =>
      this.publishTicketChangedUsecase.call({
        userId: ticket.userId,
        ticket: { ...ticket, state: TicketState.EXPIRED },
      }),
    );

    await Promise.all(notifyPromises);
  }
}
