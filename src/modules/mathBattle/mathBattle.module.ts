import { Module } from '@nestjs/common';

import { GatewayModule } from '@modules/gateway/gateway.module';
import { MatchmakingModule } from '@modules/matchmaking/matchmaking.module';
import { MathProblemModule } from '@modules/mathProblem/mathProblem.module';

import { MathBattleResolver } from './mathBattle.resolver';
import { GetMathBattleMatchMathProblems } from './usecase/getMathBattleMatchMathProblems.usecase';
import { PublishMathBattleAnswers } from './usecase/publishMathBattleAnswers.usecase';
import { SubmitMathProblemAnswer } from './usecase/submitMathProblemAnswer.usecase';
import { MathBattleAnswerModule } from '../mathBattleAnswer/mathBattleAnswer.module';
import { MathBattleResultModule } from '../mathBattleResult/mathBattleResult.module';
import { MediaFileModule } from '../mediaFile/mediaFile.module';

@Module({
  imports: [
    MediaFileModule,
    MathProblemModule,
    MatchmakingModule,
    GatewayModule,
    MathBattleAnswerModule,
    MathBattleResultModule,
  ],
  providers: [
    // usecase
    SubmitMathProblemAnswer,
    PublishMathBattleAnswers,
    GetMathBattleMatchMathProblems,
    // resolver
    MathBattleResolver,
  ],
})
export class MathBattleModule {}
