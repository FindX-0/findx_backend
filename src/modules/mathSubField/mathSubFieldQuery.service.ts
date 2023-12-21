import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage } from '@shared/type';

import { SelectableMathSubField } from './mathSubField.entity';
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
  ): Promise<DataPage<SelectableMathSubField>> {
    const data = await this.mathSubFieldRepository.filter(filter);

    const count = await this.mathSubFieldRepository.count(filter);

    return { data, count };
  }

  async countBy(params: CountMathSubFieldParams): Promise<number> {
    return this.mathSubFieldRepository.count(params);
  }

  async getAllIds(): Promise<string[]> {
    return this.mathSubFieldRepository.getAllIds();
  }
}
