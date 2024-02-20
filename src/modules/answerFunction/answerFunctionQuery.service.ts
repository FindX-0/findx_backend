import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage } from '@shared/type';

import { SelectableAnswerFunction } from './answerFunction.entity';
import { AnswerFunctionRepository } from './answerFunction.repository';
import {
  FilterAnswerFunctionParams,
  GetAllAnswerFunctionParams,
} from './answerFunction.type';

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
    filter: FilterAnswerFunctionParams,
  ): Promise<DataPage<SelectableAnswerFunction>> {
    const count = await this.answerFunctionRepository.count(filter);

    if (!count) {
      return { data: [], count: 0 };
    }

    const data = await this.answerFunctionRepository.filter(filter);

    return { data, count };
  }

  async getAll(
    params: GetAllAnswerFunctionParams,
  ): Promise<SelectableAnswerFunction[]> {
    return this.answerFunctionRepository.getAll(params);
  }
}
