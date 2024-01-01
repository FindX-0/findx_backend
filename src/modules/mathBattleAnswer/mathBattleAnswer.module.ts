import { Module } from '@nestjs/common';

import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';
import { MathBattleAnswerMutationService } from './mathBattleAnswerMutation.service';
import { MathBattleAnswerQueryService } from './mathBattleAnswerQuery.service';

@Module({
  imports: [],
  providers: [
    MathBattleAnswerRepository,
    MathBattleAnswerQueryService,
    MathBattleAnswerMutationService,
  ],
  exports: [MathBattleAnswerQueryService, MathBattleAnswerMutationService],
})
export class MathBattleAnswerModule {}
