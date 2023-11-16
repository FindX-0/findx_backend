import { Injectable } from '@nestjs/common';

import { TicketState } from '@entities/entityEnums';

import { TicketRepository } from '../repository/ticket.repository';

type EnqueueTicketParams = {
  userId: string;
  mathFieldId: string;
};

@Injectable()
export class EnqueueTicketUseCase {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async call({ userId, mathFieldId }: EnqueueTicketParams) {
    await this.ticketRepository.updateAllProcessing({
      userId,
      payload: {
        state: TicketState.CANCELLED,
      },
    });

    await this.ticketRepository.create({
      matchId: null,
      mathFieldId,
      userId,
      state: TicketState.PROCESSING,
    });
  }
}
