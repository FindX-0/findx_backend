import { Module } from '@nestjs/common';

import { GatewayModule } from '@modules/gateway/gateway.module';
import { MatchmakingModule } from '@modules/matchmaking/matchmaking.module';
import { MathProblemModule } from '@modules/mathProblem/mathProblem.module';

import { MathBattleResolver } from './mathBattle.resolver';
import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';
import { MathBattleAnswerMutationService } from './mathBattleAnswerMutation.service';
import { MathBattleAnswerQueryService } from './mathBattleAnswerQuery.service';
import { PublishMathBattleAnswers } from './usecase/publishMathBattleAnswers.usecase';
import { SubmitMathProblemAnswer } from './usecase/submitMathProblemAnswer.usecase';

@Module({
  imports: [MathProblemModule, MatchmakingModule, GatewayModule],
  providers: [
    MathBattleAnswerRepository,
    MathBattleAnswerMutationService,
    MathBattleAnswerQueryService,
    SubmitMathProblemAnswer,
    PublishMathBattleAnswers,
    MathBattleResolver,
  ],
})
export class MathBattleModule {}
