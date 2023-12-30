import { Injectable } from '@nestjs/common';

import { NewMathBattleAnswer } from './mathBattleAnswer.entity';
import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';

@Injectable()
export class MathBattleAnswerMutationService {
  constructor(
    private readonly mathBattleAnswerRepository: MathBattleAnswerRepository,
  ) {}

  async create(values: NewMathBattleAnswer) {
    return this.mathBattleAnswerRepository.create(values);
  }
}
