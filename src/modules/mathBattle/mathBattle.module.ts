import { Module } from '@nestjs/common';

import { MatchmakingModule } from '@modules/matchmaking/matchmaking.module';
import { MathProblemModule } from '@modules/mathProblem/mathProblem.module';

import { MathBattleResolver } from './mathBattle.resolver';
import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';
import { MathBattleAnswerMutationService } from './mathBattleAnswerMutation.service';
import { SubmitMathProblemAnswer } from './usecase/submitMathProblemAnswer.usecase';

@Module({
  imports: [MathProblemModule, MatchmakingModule],
  providers: [
    MathBattleAnswerRepository,
    MathBattleAnswerMutationService,
    SubmitMathProblemAnswer,
    MathBattleResolver,
  ],
})
export class MathBattleModule {}
