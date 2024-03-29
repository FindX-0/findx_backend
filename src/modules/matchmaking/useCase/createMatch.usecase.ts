import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { EnvService } from '@config/env/env.service';
import { MatchState, TicketState } from '@entities/index';
import { MathSubFieldQueryService } from '@modules/mathSubField/mathSubFieldQuery.service';
import { TransactionProvider, splitNumIntoChunks } from '@shared/util';

import { UpdateTicketAndPublish } from './updateTicketAndPublish.usecase';
import { uuidV4 } from '../../../shared/util/random';
import { MathProblemQueryService } from '../../mathProblem/mathProblemQuery.service';
import { SelectableMatch } from '../entity/match.entity';
import { SelectableTicket } from '../entity/ticket.entity';
import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class CreateMatch {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly envService: EnvService,
    private readonly updateTicketAndPublishUsecase: UpdateTicketAndPublish,
    private readonly mathSubFieldQueryService: MathSubFieldQueryService,
    private readonly mathProblemQueryService: MathProblemQueryService,
  ) {}

  private readonly logger = new Logger(CreateMatch.name);

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
        state: MatchState.IN_PROGRESS,
        mathProblemIds: await this.resolveMathProblemIds(mathFieldId),
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
          concurrencyTimestamp: uuidV4(),
        },
        txProvider,
      }),
      this.updateTicketAndPublishUsecase.call({
        ticketId: ticketB.id,
        payload: {
          state: TicketState.COMPLETED,
          matchId: match.id,
          concurrencyTimestamp: uuidV4(),
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

  private async resolveMathProblemIds(mathFieldId: string): Promise<string[]> {
    const mathSubFieldIds =
      await this.mathSubFieldQueryService.getAllIdsByMathFieldId(mathFieldId);

    if (!mathSubFieldIds.length) {
      return [];
    }

    const mathProblemCount = 200;

    const randomMathProblemIds = await Promise.all(
      splitNumIntoChunks(
        mathProblemCount,
        Math.ceil(mathProblemCount / mathSubFieldIds.length),
      ).map((count, index) => {
        const mathSubFieldId = mathSubFieldIds[index];

        if (!mathSubFieldId) {
          throw new InternalServerErrorException();
        }

        return this.mathProblemQueryService.getRandomIds({
          mathSubFieldId,
          maxCount: count,
          difficultyRange: [1, 100],
        });
      }),
    );

    return randomMathProblemIds.flat(1);
  }
}
