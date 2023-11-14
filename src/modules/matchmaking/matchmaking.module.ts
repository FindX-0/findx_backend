import { Module } from '@nestjs/common';

import { MatchmakingResolver } from './matchmaking.resolver';
import { TicketRepository } from './repository/ticket.repository';
import { EnqueueTicketUseCase } from './useCase/enqueueTicket.usecase';

@Module({
  providers: [TicketRepository, EnqueueTicketUseCase, MatchmakingResolver],
})
export class MatchmakingModule {}
