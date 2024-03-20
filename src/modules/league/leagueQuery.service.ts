import { Injectable, NotFoundException } from '@nestjs/common';

import { SelectableLeague } from './league.entity';
import { LeagueRepository } from './league.repository';
import { ExceptionMessageCode } from '../../shared/constant';

@Injectable()
export class LeagueQueryService {
  constructor(private readonly leagueRepository: LeagueRepository) {}

  async getBellowClosestToTrophyByMathFieldId(params: {
    trophy: number;
    mathFieldId: string;
  }): Promise<SelectableLeague | null> {
    const league =
      await this.leagueRepository.getBellowClosestToTrophyByMathFieldId(params);

    if (!league) {
      throw new NotFoundException(ExceptionMessageCode.LEAGUE_NOT_FOUND);
    }

    return league;
  }
}
