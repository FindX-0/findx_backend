import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage, LastIdPageParams } from '@shared/type';

import {
  MathSubFieldUpdate,
  NewMathSubField,
  SelectableMathSubField,
} from './mathSubField.entity';
import { MathSubFieldRepository } from './mathSubField.repository';

@Injectable()
export class MathSubFieldCrudService {
  constructor(
    private readonly mathSubFieldRepository: MathSubFieldRepository,
  ) {}

  async create(values: NewMathSubField): Promise<SelectableMathSubField> {
    const entity = await this.mathSubFieldRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_SUB_FIELD,
      );
    }

    return entity;
  }

  async updateById(
    id: string,
    values: MathSubFieldUpdate,
  ): Promise<SelectableMathSubField> {
    const entity = await this.mathSubFieldRepository.updateById(id, values);

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.MATH_SUB_FIELD_NOT_FOUND,
      );
    }

    return entity;
  }

  async getById(id: string): Promise<SelectableMathSubField> {
    const entity = await this.mathSubFieldRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.MATH_SUB_FIELD_NOT_FOUND,
      );
    }

    return entity;
  }

  async deleteById(id: string): Promise<void> {
    const didDelete = await this.mathSubFieldRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(
        ExceptionMessageCode.MATH_SUB_FIELD_NOT_FOUND,
      );
    }
  }

  async filter(
    filter: LastIdPageParams,
  ): Promise<DataPage<SelectableMathSubField>> {
    const data = await this.mathSubFieldRepository.filter(filter);

    const count = await this.mathSubFieldRepository.count();

    return { data, count };
  }
}
