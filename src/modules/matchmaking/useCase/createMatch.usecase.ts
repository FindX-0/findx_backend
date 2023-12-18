import { Injectable, Logger } from '@nestjs/common';

import { EnvService } from '@config/env';
import { MatchState, TicketState } from '@entities/entityEnums';
import { TransactionProvider } from '@shared/util';

import { UpdateTicketAndPublishUsecase } from './updateTicketAndPublish.usecase';
import { SelectableTicket } from '../entity';
import { SelectableMatch } from '../entity/match.entity';
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
}
