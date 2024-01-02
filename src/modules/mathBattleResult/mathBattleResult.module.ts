import { Module } from '@nestjs/common';

import { MathBattleResultRepository } from './mathBattleResult.repository';
import { MathBattleResultResolver } from './mathBattleResult.resolver';
import { MathBattleResultMutationService } from './mathBattleResultMutation.service';
import { MathBattleResultQueryService } from './mathBattleResultQuery.service';

@Module({
  providers: [
    MathBattleResultRepository,
    MathBattleResultQueryService,
    MathBattleResultMutationService,
    MathBattleResultResolver,
  ],
  exports: [MathBattleResultQueryService, MathBattleResultMutationService],
})
export class MathBattleResultModule {}
