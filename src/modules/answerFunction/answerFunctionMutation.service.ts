import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  AnswerFunctionUpdateWeightNum,
  SelectableAnswerFunction,
  NewAnswerFunctionWeightNum,
} from './answerFunction.entity';
import { AnswerFunctionRepository } from './answerFunction.repository';
import { NormalizeAnswerFunctionWeight } from './usecase/normalizeAnswerFunctionWeight.usecase';

@Injectable()
export class AnswerFunctionMutationService {
  constructor(
    private readonly answerFunctionRepository: AnswerFunctionRepository,
    private readonly normalizeAnswerFunctionWeight: NormalizeAnswerFunctionWeight,
  ) {}

  async create(
    values: NewAnswerFunctionWeightNum,
  ): Promise<SelectableAnswerFunction> {
    await this.normalizeAnswerFunctionWeight.normalizeForCreate(values);

    const entity = await this.answerFunctionRepository.create({
      ...values,
      weight: values.weight.toString(),
    });

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_ANSWER_FUNCTION,
      );
    }

    return entity;
  }

  async updateById(
    id: string,
    values: AnswerFunctionUpdateWeightNum,
  ): Promise<SelectableAnswerFunction> {
    await this.normalizeAnswerFunctionWeight.normalizeForUpdate(id, values);

    const { weight, ...restValues } = values;

    const entity = await this.answerFunctionRepository.updateById(id, {
      ...restValues,
      ...(weight && { weight: weight.toString() }),
    });

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }

    return entity;
  }

  async deleteById(id: string): Promise<void> {
    const didDelete = await this.answerFunctionRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }
  }
}
