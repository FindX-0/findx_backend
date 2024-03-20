import { Injectable, NotFoundException } from '@nestjs/common';

import { SelectableStandardTrophyRangeSystem } from './standardTrophyRangeSystem.entity';
import { StandardTrophyRangeSystemRepository } from './standardTrophyRangeSystem.repository';
import { ExceptionMessageCode } from '../../shared/constant';

@Injectable()
export class StandardTrophyRangeSystemQueryService {
  constructor(
    private readonly standardTrophyRangeSystemRepository: StandardTrophyRangeSystemRepository,
  ) {}

  async getBellowClosestByMathFieldId(params: {
    trophy: number;
    mathFieldId: string;
  }): Promise<SelectableStandardTrophyRangeSystem> {
    const entity =
      await this.standardTrophyRangeSystemRepository.getBellowClosestByMathFieldId(
        params,
      );

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.STANDARD_TROPHY_RANGE_SYSTEM_NOT_FOUND,
      );
    }

    return entity;
  }
}
