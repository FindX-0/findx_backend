import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/entityEnums';
import { PublishMatchChangedUsecase } from '@modules/gateway';

import { SelectableMatch } from '../entity';
import { MatchRepository } from '../repository/match.repository';

@Injectable()
export class FinishMatchAndPublishUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly publishMatchChangedUsecase: PublishMatchChangedUsecase,
  ) {}

  async call(match: SelectableMatch): Promise<void> {
    await this.matchRepository.updateStateById(match.id, MatchState.FINISHED);

    await this.publishMatchChangedUsecase.call(match);
  }
}
