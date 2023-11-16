import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { TicketState } from '@entities/entityEnums';
import { SelectableTicket } from '@entities/ticket.entity';
import {
  TransactionProvider,
  TransactionRunner,
  groupByToMap,
} from '@shared/util';

import { TicketRepository } from '../repository/ticket.repository';
import { CreateMatchUseCase } from '../useCase/createMatch.usecase';

@Injectable()
export class MatchmakingScheduler {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  @Interval(8000)
  async handleTickets(): Promise<void> {
    const processingTickets = await this.ticketRepository.getAll({
      state: TicketState.PROCESSING,
    });

    const ticketsGroupedByMatchFieldId = groupByToMap(
      processingTickets,
      (ticket) => ticket.mathFieldId,
    );

    await this.transactionRunner.runTransaction(async (txProvider) => {
      for (const [mathFieldId, tickets] of ticketsGroupedByMatchFieldId) {
        for (let i = 0; i < tickets.length - 1; i += 2) {
          await this.createMatch({
            ticketA: tickets[i],
            ticketB: tickets[i + 1],
            txProvider,
            mathFieldId,
          });
        }
      }
    });
  }

  private async createMatch({
    ticketA,
    ticketB,
    txProvider,
    mathFieldId,
  }: {
    ticketA: SelectableTicket;
    ticketB: SelectableTicket;
    txProvider: TransactionProvider;
    mathFieldId: string;
  }) {
    const match = await this.createMatchUseCase.call({
      mathFieldId,
      txProvider,
    });

    await this.ticketRepository.updateById(
      ticketA.id,
      {
        state: TicketState.COMPLETED,
        matchId: match.id,
      },
      txProvider.get(),
    );

    await this.ticketRepository.updateById(
      ticketB.id,
      {
        state: TicketState.COMPLETED,
        matchId: match.id,
      },
      txProvider.get(),
    );
  }
}
