import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '../../../shared/constant';
import {
  AnswerFunctionUpdateWeightNum,
  NewAnswerFunctionWeightNum,
  SelectableAnswerFunction,
} from '../answerFunction.entity';
import { AnswerFunctionRepository } from '../answerFunction.repository';

@Injectable()
export class NormalizeAnswerFunctionWeight {
  constructor(
    private readonly answerFunctionRepository: AnswerFunctionRepository,
  ) {}

  async normalizeForCreate(values: NewAnswerFunctionWeightNum): Promise<void> {
    const { answerFunctions, weightSum } = await this.sumAnswerFunctionWeights({
      notIncludeId: null,
    });

    if (weightSum + values.weight < 99) {
      return;
    }

    return this.normalizeAnswerFunctionWeights(
      values.weight,
      answerFunctions,
      'sub',
    );
  }

  async normalizeForUpdate(
    id: string,
    values: AnswerFunctionUpdateWeightNum,
  ): Promise<void> {
    if (!values.weight) {
      return;
    }

    const { answerFunctions, weightSum } = await this.sumAnswerFunctionWeights({
      notIncludeId: id,
    });

    if (weightSum + values.weight < 99) {
      return;
    }

    return this.normalizeAnswerFunctionWeights(
      values.weight,
      answerFunctions,
      'sub',
    );
  }

  async normalizeForDelete(answerFunctionId: string): Promise<void> {
    const answerFunctionToBeDeleted =
      await this.answerFunctionRepository.getById(answerFunctionId);

    if (!answerFunctionToBeDeleted) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }

    const { answerFunctions, weightSum } = await this.sumAnswerFunctionWeights({
      notIncludeId: answerFunctionId,
    });

    const answerFunctionWeight = parseFloat(answerFunctionToBeDeleted.weight);

    if (weightSum + answerFunctionWeight < 99) {
      return;
    }

    await this.normalizeAnswerFunctionWeights(
      answerFunctionWeight,
      answerFunctions,
      'add',
    );
  }

  private async sumAnswerFunctionWeights({
    notIncludeId,
  }: {
    notIncludeId: string | null;
  }): Promise<{
    answerFunctions: SelectableAnswerFunction[];
    weightSum: number;
  }> {
    const answerFunctions = await this.answerFunctionRepository.getAll({
      notIncludeId,
    });

    const weightSum = answerFunctions.reduce(
      (acc, answerFunction) => acc + parseFloat(answerFunction.weight),
      0,
    );

    return { answerFunctions, weightSum };
  }

  private async normalizeAnswerFunctionWeights(
    weight: number,
    answerFunctions: SelectableAnswerFunction[],
    op: 'add' | 'sub',
  ): Promise<void> {
    // normalize answer function weights
    const normalizeWeight = weight / answerFunctions.length;

    const updatePromises = answerFunctions.map((answerFunction) =>
      this.answerFunctionRepository.updateById(answerFunction.id, {
        weight: (
          parseFloat(answerFunction.weight) +
          normalizeWeight * (op === 'add' ? 1 : -1)
        ).toString(),
      }),
    );

    await Promise.all(updatePromises);
  }
}
