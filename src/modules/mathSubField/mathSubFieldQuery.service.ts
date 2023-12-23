import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage } from '@shared/type';

import {
  SelectableMathSubField,
  SelectableMathSubFieldWithRelations,
} from './mathSubField.entity';
import { MathSubFieldRepository } from './mathSubField.repository';
import {
  CountMathSubFieldParams,
  FilterMathSubFieldParams,
} from './mathSubField.type';

@Injectable()
export class MathSubFieldQueryService {
  constructor(
    private readonly mathSubFieldRepository: MathSubFieldRepository,
  ) {}

  async getById(id: string): Promise<SelectableMathSubField> {
    const entity = await this.mathSubFieldRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.MATH_SUB_FIELD_NOT_FOUND,
      );
    }

    return entity;
  }

  async filter(
    filter: FilterMathSubFieldParams,
  ): Promise<DataPage<SelectableMathSubFieldWithRelations>> {
    const count = await this.mathSubFieldRepository.count(filter);

    if (!count) {
      return { data: [], count: 0 };
    }

    const data = await this.mathSubFieldRepository.filter(filter);

    return { data, count };
  }

  async countBy(params: CountMathSubFieldParams): Promise<number> {
    return this.mathSubFieldRepository.count(params);
  }

  async getAllIdsByMathFieldId(mathFieldId: string): Promise<string[]> {
    return this.mathSubFieldRepository.getAllIdsByMathFieldId(mathFieldId);
  }
}
