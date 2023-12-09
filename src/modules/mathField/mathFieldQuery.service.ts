import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage, LastIdPageParams } from '@shared/type';

import { SelectableMathField } from './mathField.entity';
import { MathFieldRepository } from './mathField.repository';
import { FilterAllMathFieldParams } from './mathField.type';

@Injectable()
export class MathFieldQueryService {
  constructor(private readonly mathFieldRepository: MathFieldRepository) {}

  async getById(id: string): Promise<SelectableMathField> {
    const entity = await this.mathFieldRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.MATH_FIELD_NOT_FOUND);
    }

    return entity;
  }

  async filter(
    filter: LastIdPageParams,
  ): Promise<DataPage<SelectableMathField>> {
    const data = await this.mathFieldRepository.filter(filter);

    const count = await this.mathFieldRepository.count();

    return { data, count };
  }

  async getAll(
    params: FilterAllMathFieldParams,
  ): Promise<SelectableMathField[]> {
    return this.mathFieldRepository.getAll(params);
  }
}
