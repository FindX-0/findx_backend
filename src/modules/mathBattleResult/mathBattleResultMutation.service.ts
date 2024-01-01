import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  NewMathBattleResult,
  SelectableMathBattleResult,
} from './mathBattleResult.entity';
import { MathBattleResultRepository } from './mathBattleResult.repository';

@Injectable()
export class MathBattleResultMutationService {
  constructor(
    private readonly mathBattleResultRepository: MathBattleResultRepository,
  ) {}

  async create(
    values: NewMathBattleResult,
  ): Promise<SelectableMathBattleResult> {
    const entity = await this.mathBattleResultRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_BATTLE_RESULT,
      );
    }

    return entity;
  }
}
