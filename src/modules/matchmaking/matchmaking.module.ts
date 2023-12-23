import { Module } from '@nestjs/common';

import { MathProblemModule } from '@modules/mathProblem/mathProblem.module';
import { MathSubFieldModule } from '@modules/mathSubField/module/mathSubField.module';

import { MatchmakingResolver } from './matchmaking.resolver';
import { MatchRepository } from './repository/match.repository';
import { TicketRepository } from './repository/ticket.repository';
import { MatchmakingScheduler } from './schedule/matchmaking.scheduler';
import { CreateMatchUseCase } from './useCase/createMatch.usecase';
import { EnqueueTicketUseCase } from './useCase/enqueueTicket.usecase';
import { ExpireTicketsAndNotifyUsecase } from './useCase/expireTIcketsAndNotify.usecase';
import { FinishMatchAndPublishUseCase } from './useCase/finishMatchAndPublish.usecase';
import { UpdateTicketAndPublishUsecase } from './useCase/updateTicketAndPublish.usecase';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule, MathProblemModule, MathSubFieldModule],
  providers: [
    // repository
    TicketRepository,
    MatchRepository,
    // usecases
    EnqueueTicketUseCase,
    CreateMatchUseCase,
    FinishMatchAndPublishUseCase,
    UpdateTicketAndPublishUsecase,
    ExpireTicketsAndNotifyUsecase,
    // resolver/scheduler
    MatchmakingResolver,
    MatchmakingScheduler,
  ],
})
export class MatchmakingModule {}
