import { Injectable } from '@nestjs/common';

import { MatchState } from '@entities/index';
import { PublishMatchChangedUsecase } from '@modules/gateway/usecase/publishMatchChanged.usecase';

import { SelectableMatch } from '../entity/match.entity';
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
