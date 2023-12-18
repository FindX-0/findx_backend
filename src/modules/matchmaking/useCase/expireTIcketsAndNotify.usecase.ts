import { Injectable } from '@nestjs/common';

import { TicketState } from '@entities/entityEnums';
import { PublishTicketChangedUsecase } from '@modules/gateway';
import { TransactionProvider } from '@shared/util';

import { SelectableTicket } from '../entity';
import { TicketRepository } from '../repository/ticket.repository';

@Injectable()
export class ExpireTicketsAndNotifyUsecase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly publishTicketChangedUsecase: PublishTicketChangedUsecase,
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
      { state: TicketState.EXPIRED },
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
