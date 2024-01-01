import { Injectable } from '@nestjs/common';

import { SelectableMathBattleResult } from './mathBattleResult.entity';
import { MathBattleResultRepository } from './mathBattleResult.repository';

@Injectable()
export class MathBattleResultQueryService {
  constructor(
    private readonly mathBattleResultRepository: MathBattleResultRepository,
  ) {}

  async getAllByMatchId(
    matchId: string,
  ): Promise<SelectableMathBattleResult[]> {
    return this.mathBattleResultRepository.getAllByMatchId(matchId);
  }
}
