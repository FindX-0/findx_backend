import { Injectable } from '@nestjs/common';

import { SelectableMathBattleAnswer } from './mathBattleAnswer.entity';
import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';

@Injectable()
export class MathBattleAnswerQueryService {
  constructor(
    private readonly mathBattleAnswerRepository: MathBattleAnswerRepository,
  ) {}

  async getAllByMatchId(
    matchId: string,
  ): Promise<SelectableMathBattleAnswer[]> {
    return this.mathBattleAnswerRepository.getAllByMatchId(matchId);
  }

  async getLastByMatchIdAndUserId(
    matchId: string,
    userId: string,
  ): Promise<SelectableMathBattleAnswer | null> {
    return this.mathBattleAnswerRepository.getLastByMatchIdAndUserId(
      matchId,
      userId,
    );
  }
}
