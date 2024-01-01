import { Module } from '@nestjs/common';

import { MathBattleResultRepository } from './mathBattleResult.repository';
import { MathBattleResultMutationService } from './mathBattleResultMutation.service';
import { MathBattleResultQueryService } from './mathBattleResultQuery.service';

@Module({
  providers: [
    MathBattleResultRepository,
    MathBattleResultQueryService,
    MathBattleResultMutationService,
  ],
  exports: [MathBattleResultQueryService, MathBattleResultMutationService],
})
export class MathBattleResultModule {}
