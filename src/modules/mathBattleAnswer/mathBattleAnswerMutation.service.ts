import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  NewMathBattleAnswer,
  SelectableMathBattleAnswer,
} from './mathBattleAnswer.entity';
import { MathBattleAnswerRepository } from './mathBattleAnswer.repository';

@Injectable()
export class MathBattleAnswerMutationService {
  constructor(
    private readonly mathBattleAnswerRepository: MathBattleAnswerRepository,
  ) {}

  async create(
    values: NewMathBattleAnswer,
  ): Promise<SelectableMathBattleAnswer> {
    const entity = await this.mathBattleAnswerRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_BATTLE_ANSWER,
      );
    }

    return entity;
  }
}
