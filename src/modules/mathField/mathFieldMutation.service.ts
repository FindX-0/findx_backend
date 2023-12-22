import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  MathFieldUpdate,
  NewMathField,
  SelectableMathField,
} from './mathField.entity';
import { MathFieldRepository } from './mathField.repository';
import { MathSubFieldQueryService } from '../mathSubField/mathSubFieldQuery.service';

@Injectable()
export class MathFieldMutationService {
  constructor(
    private readonly mathFieldRepository: MathFieldRepository,
    private readonly mathSubFieldQueryService: MathSubFieldQueryService,
  ) {}

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

  async deleteById(id: string): Promise<void> {
    const mathSubFieldCount = await this.mathSubFieldQueryService.countBy({
      mathFieldId: id,
    });

    if (mathSubFieldCount > 0) {
      throw new ConflictException(
        ExceptionMessageCode.MATH_FIELD_HAS_RELATIONS,
      );
    }

    const didDelete = await this.mathFieldRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.MATH_FIELD_NOT_FOUND);
    }
  }
}
