import { Injectable, Logger } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';

import { EnvService } from '@config/env';
import { TicketState } from '@entities/entityEnums';
import {
  TransactionProvider,
  TransactionRunner,
  groupByToMap,
} from '@shared/util';
import { TimeoutNameFactory } from '@shared/util/timeoutName.factory';

import { SelectableTicket } from '../entity/ticket.entity';
import { TicketRepository } from '../repository/ticket.repository';
import { CreateMatchUseCase } from '../useCase/createMatch.usecase';
import { FinishMatchUseCase } from '../useCase/finishMatch.usecase';
import { UpdateTicketAndPublishUsecase } from '../useCase/updateTicketAndPublish.usecase';

@Injectable()
export class MatchmakingScheduler {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly finishMatchUseCase: FinishMatchUseCase,
    private readonly transactionRunner: TransactionRunner,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly envService: EnvService,
    private readonly updateTicketAndPublishUsecase: UpdateTicketAndPublishUsecase,
  ) {}

  private readonly logger = new Logger(MatchmakingScheduler.name);

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
          const ticketA = tickets[i];
          const ticketB = tickets[i + 1];

          if (!ticketA || !ticketB) {
            continue;
          }

          await this.createMatch({
            ticketA,
            ticketB,
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
    const matchCreatedAt = new Date();
    const matchStartAt = new Date(
      matchCreatedAt.getTime() + this.envService.get('MATCH_START_DELAY'),
    );
    const matchEndAt = new Date(
      matchStartAt.getTime() + this.envService.get('MATCH_LIFETIME_MILLIS'),
    );

    const match = await this.createMatchUseCase.call(
      {
        mathFieldId,
        createdAt: matchCreatedAt,
        startAt: matchStartAt,
        endAt: matchEndAt,
      },
      txProvider,
    );

    if (!match) {
      this.logger.error('Create match returned null');
      return;
    }

    await Promise.all([
      this.updateTicketAndPublishUsecase.call({
        ticketId: ticketA.id,
        payload: {
          state: TicketState.COMPLETED,
          matchId: match.id,
        },
        txProvider,
      }),
      this.updateTicketAndPublishUsecase.call({
        ticketId: ticketB.id,
        payload: {
          state: TicketState.COMPLETED,
          matchId: match.id,
        },
        txProvider,
      }),
    ]);

    const timePassed = Date.now() - match.createdAt.getTime();
    const matchTimeout =
      this.envService.get('MATCH_START_DELAY') +
      this.envService.get('MATCH_LIFETIME_MILLIS') -
      timePassed;

    const timeout = setTimeout(
      () => this.finishMatchUseCase.call(match.id, txProvider),
      matchTimeout,
    );

    this.schedulerRegistry.addTimeout(
      TimeoutNameFactory.finishMatchTimeoutName(match.id),
      timeout,
    );
  }
}
