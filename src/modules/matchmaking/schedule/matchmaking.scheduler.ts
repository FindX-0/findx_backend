import { Injectable, Logger } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';

import { EnvService } from '@config/env';
import { TicketState } from '@entities/entityEnums';
import { PublishTicketChangedUsecase } from '@modules/gateway';
import {
  TransactionProvider,
  TransactionRunner,
  groupByToMap,
  partition,
} from '@shared/util';
import { TimeoutNameFactory } from '@shared/util/timeoutName.factory';

import { SelectableTicket } from '../entity/ticket.entity';
import { TicketRepository } from '../repository/ticket.repository';
import { CreateMatchUseCase } from '../useCase/createMatch.usecase';
import { FinishMatchAndPublishUseCase } from '../useCase/finishMatchAndPublish.usecase';
import { UpdateTicketAndPublishUsecase } from '../useCase/updateTicketAndPublish.usecase';

@Injectable()
export class MatchmakingScheduler {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly finishMatchUseCase: FinishMatchAndPublishUseCase,
    private readonly transactionRunner: TransactionRunner,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly envService: EnvService,
    private readonly updateTicketAndPublishUsecase: UpdateTicketAndPublishUsecase,
    private readonly publishTicketChangesUsecase: PublishTicketChangedUsecase,
  ) {}

  private readonly logger = new Logger(MatchmakingScheduler.name);

  @Interval(4000)
  async handleTickets(): Promise<void> {
    const processingTickets = await this.ticketRepository.getAll({
      state: TicketState.PROCESSING,
    });

    if (!processingTickets.length) {
      return;
    }

    const now = new Date();

    const [expiredTickets, nonExpiredTickets] = partition(
      processingTickets,
      (e) => {
        const expiryTime =
          e.createdAt.getTime() + this.envService.get('TICKET_LIFETIME_MILLIS');

        return expiryTime >= now.getTime();
      },
    );

    const nonExpiredTicketsGroupedByMatchFieldId = groupByToMap(
      nonExpiredTickets,
      (ticket) => ticket.mathFieldId,
    );

    await this.transactionRunner.runTransaction(async (txProvider) => {
      await this.ticketRepository.updateAllByIds(
        expiredTickets.map((e) => e.id),
        { state: TicketState.EXPIRED },
      );

      for (const [
        mathFieldId,
        tickets,
      ] of nonExpiredTicketsGroupedByMatchFieldId) {
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

    await Promise.all(
      expiredTickets.map((ticket) => {
        return this.publishTicketChangesUsecase.call({
          userId: ticket.userId,
          ticket,
        });
      }),
    );
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
    const matchCloseAt = new Date(
      matchEndAt.getTime() + this.envService.get('MATCH_CLOSE_DELAY'),
    );

    const match = await this.createMatchUseCase.call(
      {
        mathFieldId,
        createdAt: matchCreatedAt,
        startAt: matchStartAt,
        endAt: matchEndAt,
        closeAt: matchCloseAt,
        userIds: [ticketA.userId, ticketB.userId],
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
      () => this.finishMatchUseCase.call(match),
      matchTimeout,
    );

    this.schedulerRegistry.addTimeout(
      TimeoutNameFactory.finishMatchTimeoutName(match.id),
      timeout,
    );
  }
}