import { Injectable } from '@nestjs/common';

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

    return this.normalizeAnswerFunctionWeights(values.weight, answerFunctions);
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

    return this.normalizeAnswerFunctionWeights(values.weight, answerFunctions);
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
  ): Promise<void> {
    // normalize answer function weights
    const normalizeWeight = weight / answerFunctions.length;

    const updatePromises = answerFunctions.map((answerFunction) =>
      this.answerFunctionRepository.updateById(answerFunction.id, {
        weight: (
          parseFloat(answerFunction.weight) - normalizeWeight
        ).toString(),
      }),
    );

    await Promise.all(updatePromises);
  }
}
