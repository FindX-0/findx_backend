import { Injectable, Logger } from '@nestjs/common';

import { EnvService } from '@config/env';
import { MatchState, TicketState } from '@entities/index';
import { TransactionProvider } from '@shared/util';

import { UpdateTicketAndPublishUsecase } from './updateTicketAndPublish.usecase';
import { SelectableMatch } from '../entity/match.entity';
import { SelectableTicket } from '../entity/ticket.entity';
import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class CreateMatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly envService: EnvService,
    private readonly updateTicketAndPublishUsecase: UpdateTicketAndPublishUsecase,
  ) {}

  private readonly logger = new Logger(CreateMatchUseCase.name);

  async call({
    mathFieldId,
    ticketA,
    ticketB,
    txProvider,
  }: {
    mathFieldId: string;
    ticketA: SelectableTicket;
    ticketB: SelectableTicket;
    txProvider?: TransactionProvider;
  }): Promise<SelectableMatch | null> {
    const {
      createdAt: matchCreatedAt,
      startAt: matchStartAt,
      endAt: matchEndAt,
      closeAt: matchCloseAt,
    } = this.resolveMatchTimes();

    const match = await this.matchRepository.create(
      {
        mathFieldId,
        createdAt: matchCreatedAt,
        startAt: matchStartAt,
        endAt: matchEndAt,
        closeAt: matchCloseAt,
        userIds: [ticketA.userId, ticketB.userId],
        state: MatchState.PENDING,
      },
      txProvider,
    );

    if (!match) {
      this.logger.error('Create match returned null');
      return null;
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

    return match;
  }

  private resolveMatchTimes(): {
    createdAt: Date;
    startAt: Date;
    endAt: Date;
    closeAt: Date;
  } {
    const createdAt = new Date();
    const startAt = new Date(
      createdAt.getTime() + this.envService.get('MATCH_START_DELAY'),
    );
    const endAt = new Date(
      startAt.getTime() + this.envService.get('MATCH_LIFETIME_MILLIS'),
    );
    const closeAt = new Date(
      endAt.getTime() + this.envService.get('MATCH_CLOSE_DELAY'),
    );

    return { createdAt, startAt, endAt, closeAt };
  }
}
