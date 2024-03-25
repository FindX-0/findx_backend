import { Module } from '@nestjs/common';

import { MathProblemModule } from '@modules/mathProblem/mathProblem.module';
import { MathSubFieldModule } from '@modules/mathSubField/module/mathSubField.module';

import { MatchmakingResolver } from './matchmaking.resolver';
import { MatchRepository } from './repository/match.repository';
import { TicketRepository } from './repository/ticket.repository';
import { MatchmakingScheduler } from './schedule/matchmaking.scheduler';
import { MatchQueryService } from './service/matchQuery.service';
import { CalculateTrophyChange } from './useCase/calculateTrophyChange.usecase';
import { CancelTicket } from './useCase/cancelTicket.usecase';
import { CreateMatch } from './useCase/createMatch.usecase';
import { EnqueueTicket } from './useCase/enqueueTicket.usecase';
import { ExpireTicketsAndNotify } from './useCase/expireTIcketsAndNotify.usecase';
import { FinishMatch } from './useCase/finishMatch.usecase';
import { ResolveMatchResults } from './useCase/resolveMatchResults.usecase';
import { UpdateTicketAndPublish } from './useCase/updateTicketAndPublish.usecase';
import { GatewayModule } from '../gateway/gateway.module';
import { MathBattleAnswerModule } from '../mathBattleAnswer/mathBattleAnswer.module';
import { MathBattleResultModule } from '../mathBattleResult/mathBattleResult.module';
import { StandardTrophyRangeSystemModule } from '../standardTrophyRangeSystem/standardTrophyRangeSystem.module';
import { UserModule } from '../user/user.module';
import { UserMetaModule } from '../userMeta/userMeta.module';

@Module({
  imports: [
    GatewayModule,
    MathProblemModule,
    MathSubFieldModule,
    MathBattleResultModule,
    MathBattleAnswerModule,
    UserModule,
    UserMetaModule,
    StandardTrophyRangeSystemModule,
  ],
  providers: [
    // repository
    TicketRepository,
    MatchRepository,
    // service
    MatchQueryService,
    // usecases
    EnqueueTicket,
    CreateMatch,
    FinishMatch,
    UpdateTicketAndPublish,
    ExpireTicketsAndNotify,
    CancelTicket,
    ResolveMatchResults,
    CalculateTrophyChange,
    // resolver/scheduler
    MatchmakingResolver,
    MatchmakingScheduler,
  ],
  exports: [MatchQueryService],
})
export class MatchmakingModule {}
