import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage, LastIdPageParams } from '@shared/type';

import {
  MathFieldUpdate,
  NewMathField,
  SelectableMathField,
} from './mathField.entity';
import { MathFieldRepository } from './mathField.repository';

@Injectable()
export class MathFieldCrudService {
  constructor(private readonly mathFieldRepository: MathFieldRepository) {}

  async create(values: NewMathField): Promise<SelectableMathField> {
    const entity = await this.mathFieldRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_FIELD,
      );
    }

    return entity;
  }

  async updateById(
    id: string,
    values: MathFieldUpdate,
  ): Promise<SelectableMathField> {
    const entity = await this.mathFieldRepository.updateById(id, values);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.MATH_FIELD_NOT_FOUND);
    }

    return entity;
  }

  async getById(id: string): Promise<SelectableMathField> {
    const entity = await this.mathFieldRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.MATH_FIELD_NOT_FOUND);
    }

    return entity;
  }

  async deleteById(id: string): Promise<void> {
    const didDelete = await this.mathFieldRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.MATH_FIELD_NOT_FOUND);
    }
  }

  async filter(
    filter: LastIdPageParams,
  ): Promise<DataPage<SelectableMathField>> {
    const data = await this.mathFieldRepository.filter(filter);

    const count = await this.mathFieldRepository.count();

    return { data, count };
  }
}
