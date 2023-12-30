import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/index';

import { SelectableMatch } from '../entity/match.entity';
import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class FinishMatch {
  constructor(private readonly matchRepository: MatchRepository) {}

  async call(match: SelectableMatch): Promise<void> {
    await this.matchRepository.updateStateById(match.id, MatchState.FINISHED);
  }
}
