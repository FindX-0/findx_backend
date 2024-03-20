import { Module } from '@nestjs/common';

import { LeagueRepository } from './league.repository';
import { LeagueQueryService } from './leagueQuery.service';

@Module({
  providers: [LeagueRepository, LeagueQueryService],
  exports: [LeagueQueryService],
})
export class LeagueModule {}
