import { Module } from '@nestjs/common';

import { GatewayModule } from '@modules/gateway/gateway.module';
import { MatchmakingModule } from '@modules/matchmaking/matchmaking.module';
import { MathProblemModule } from '@modules/mathProblem/mathProblem.module';

import { MathBattleResolver } from './mathBattle.resolver';
import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';
import { MathBattleAnswerMutationService } from './mathBattleAnswerMutation.service';
import { MathBattleAnswerQueryService } from './mathBattleAnswerQuery.service';
import { GetMathBattleMatchMathProblems } from './usecase/getMathBattleMatchMathProblems.usecase';
import { PublishMathBattleAnswers } from './usecase/publishMathBattleAnswers.usecase';
import { SubmitMathProblemAnswer } from './usecase/submitMathProblemAnswer.usecase';
import { MediaFileModule } from '../mediaFile/mediaFile.module';

@Module({
  imports: [
    MediaFileModule,
    MathProblemModule,
    MatchmakingModule,
    GatewayModule,
  ],
  providers: [
    MathBattleAnswerRepository,
    MathBattleAnswerMutationService,
    MathBattleAnswerQueryService,
    SubmitMathProblemAnswer,
    PublishMathBattleAnswers,
    MathBattleResolver,
    GetMathBattleMatchMathProblems,
  ],
})
export class MathBattleModule {}
