import { Module } from '@nestjs/common';

import { StandardTrophyRangeSystemRepository } from './standardTrophyRangeSystem.repository';
import { StandardTrophyRangeSystemQueryService } from './standardTrophyRangeSystemQuery.service';

@Module({
  providers: [
    StandardTrophyRangeSystemRepository,
    StandardTrophyRangeSystemQueryService,
  ],
  exports: [StandardTrophyRangeSystemQueryService],
})
export class StandardTrophyRangeSystemModule {}
