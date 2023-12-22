import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  MathSubFieldUpdate,
  NewMathSubField,
  SelectableMathSubField,
} from './mathSubField.entity';
import { MathSubFieldRepository } from './mathSubField.repository';
import { MathProblemQueryService } from '../mathProblem/mathProblemQuery.service';

@Injectable()
export class MathSubFieldMutationService {
  constructor(
    private readonly mathSubFieldRepository: MathSubFieldRepository,
    private readonly mathProblemQueryService: MathProblemQueryService,
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

  async deleteById(id: string): Promise<void> {
    const mathProblemCount = await this.mathProblemQueryService.countBy({
      mathSubFieldId: id,
    });

    if (mathProblemCount > 0) {
      throw new ConflictException(
        ExceptionMessageCode.MATH_SUB_FIELD_HAS_RELATIONS,
      );
    }

    const didDelete = await this.mathSubFieldRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(
        ExceptionMessageCode.MATH_SUB_FIELD_NOT_FOUND,
      );
    }
  }
}
