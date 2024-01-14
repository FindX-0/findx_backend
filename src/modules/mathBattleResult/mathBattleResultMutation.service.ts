import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  NewMathBattleResult,
  SelectableMathBattleResult,
} from './mathBattleResult.entity';
import { MathBattleResultRepository } from './mathBattleResult.repository';
import { TransactionProvider } from '../../shared/util';

@Injectable()
export class MathBattleResultMutationService {
  constructor(
    private readonly mathBattleResultRepository: MathBattleResultRepository,
  ) {}

  async create(
    values: NewMathBattleResult,
    txProvider?: TransactionProvider,
  ): Promise<SelectableMathBattleResult> {
    const entity = await this.mathBattleResultRepository.create(
      values,
      txProvider,
    );

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_BATTLE_RESULT,
      );
    }

    return entity;
  }
}
