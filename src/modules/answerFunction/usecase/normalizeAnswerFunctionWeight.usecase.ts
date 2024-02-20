import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  async normalizeForCreate(
    createValues: NewAnswerFunctionWeightNum,
  ): Promise<void> {
    if (!createValues.mathSubFieldId) {
      throw new BadRequestException(
        ExceptionMessageCode.MISSING_MATH_SUB_FIELD_ID,
      );
    }

    const { answerFunctions, weightSum } = await this.sumAnswerFunctionWeights({
      mathSubFieldId: createValues.mathSubFieldId,
    });

    if (createValues.weight >= weightSum) {
      throw new BadRequestException(
        ExceptionMessageCode.INVALID_ANSWER_FUNCTION_WEIGHT,
      );
    }

    if (weightSum + createValues.weight < 99) {
      return;
    }

    return this.normalizeAnswerFunctionWeights({
      answerFunctions,
      weightSum,
      newWeight: createValues.weight,
      oldWeight: 0,
    });
  }

  async normalizeForUpdate(
    id: string,
    updateValues: AnswerFunctionUpdateWeightNum,
  ): Promise<void> {
    if (!updateValues.weight) {
      return;
    }

    const answerFunctionToBeUpdated =
      await this.answerFunctionRepository.getById(id);

    if (!answerFunctionToBeUpdated) {
      throw new NotFoundException(
        ExceptionMessageCode.ANSWER_FUNCTION_NOT_FOUND,
      );
    }

    const { answerFunctions, weightSum } = await this.sumAnswerFunctionWeights({
      mathSubFieldId: answerFunctionToBeUpdated.mathSubFieldId,
    });

    if (updateValues.weight >= weightSum) {
      throw new BadRequestException(
        ExceptionMessageCode.INVALID_ANSWER_FUNCTION_WEIGHT,
      );
    }

    if (weightSum < 99) {
      return;
    }

    return this.normalizeAnswerFunctionWeights({
      answerFunctions,
      weightSum,
      newWeight: updateValues.weight,
      oldWeight: parseFloat(answerFunctionToBeUpdated.weight),
    });
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
      mathSubFieldId: answerFunctionToBeDeleted.mathSubFieldId,
    });

    return this.normalizeAnswerFunctionWeights({
      answerFunctions,
      weightSum,
      newWeight: 0,
      oldWeight: parseFloat(answerFunctionToBeDeleted.weight),
    });
  }

  private async sumAnswerFunctionWeights({
    mathSubFieldId,
  }: {
    mathSubFieldId: string;
  }): Promise<{
    answerFunctions: SelectableAnswerFunction[];
    weightSum: number;
  }> {
    const answerFunctions = await this.answerFunctionRepository.getAll({
      mathSubFieldId,
    });

    const weightSum = answerFunctions.reduce(
      (acc, answerFunction) => acc + parseFloat(answerFunction.weight),
      0,
    );

    return { answerFunctions, weightSum };
  }

  private async normalizeAnswerFunctionWeights({
    answerFunctions,
    weightSum,
    newWeight,
    oldWeight,
  }: {
    answerFunctions: SelectableAnswerFunction[];
    weightSum: number;
    newWeight: number;
    oldWeight: number;
  }): Promise<void> {
    const updatePromises = answerFunctions.map((answerFunction) =>
      this.answerFunctionRepository.updateById(answerFunction.id, {
        weight: (
          parseFloat(answerFunction.weight) *
          (1 + (oldWeight - newWeight) / (weightSum - oldWeight))
        ).toString(),
      }),
    );

    await Promise.all(updatePromises);
  }
}
