import { Module } from '@nestjs/common';

import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';
import { MathBattleAnswerMutationService } from './mathBattleAnswerMutation.service';
import { MathBattleAnswerQueryService } from './mathBattleAnswerQuery.service';
import { CalculateMathMattleScore } from './usecase/calculateMatbBattleScore.usecase';

@Module({
  providers: [
    MathBattleAnswerRepository,
    MathBattleAnswerQueryService,
    MathBattleAnswerMutationService,
    // usecase
    CalculateMathMattleScore,
  ],
  exports: [
    MathBattleAnswerQueryService,
    MathBattleAnswerMutationService,
    CalculateMathMattleScore,
  ],
})
export class MathBattleAnswerModule {}
