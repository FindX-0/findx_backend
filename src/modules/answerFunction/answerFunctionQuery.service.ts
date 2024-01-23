import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage, LastIdPageParams } from '@shared/type';

import { SelectableAnswerFunction } from './answerFunction.entity';
import { AnswerFunctionRepository } from './answerFunction.repository';

@Injectable()
export class AnswerFunctionQueryService {
  constructor(
    private readonly answerFunctionRepository: AnswerFunctionRepository,
  ) {}

  async getById(id: string): Promise<SelectableAnswerFunction> {
    const entity = await this.answerFunctionRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }

    return entity;
  }

  async filter(
    filter: LastIdPageParams,
  ): Promise<DataPage<SelectableAnswerFunction>> {
    const data = await this.answerFunctionRepository.filter(filter);

    const count = await this.answerFunctionRepository.count();

    return { data, count };
  }

  async getAll(): Promise<SelectableAnswerFunction[]> {
    return this.answerFunctionRepository.getAll();
  }
}
