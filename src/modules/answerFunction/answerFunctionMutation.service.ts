import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import {
  AnswerFunctionUpdate,
  NewAnswerFunction,
  SelectableAnswerFunction,
} from './answerFunction.entity';
import { AnswerFunctionRepository } from './answerFunction.repository';

@Injectable()
export class AnswerFunctionMutationService {
  constructor(
    private readonly answerFunctionRepository: AnswerFunctionRepository,
  ) {}

  async create(
    values: Omit<NewAnswerFunction, 'weight'> & { weight: number },
  ): Promise<SelectableAnswerFunction> {
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
    values: Omit<AnswerFunctionUpdate, 'weight'> & { weight?: number },
  ): Promise<SelectableAnswerFunction> {
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
