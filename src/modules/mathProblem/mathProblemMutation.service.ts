import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { TransactionRunner } from '@shared/util';

import {
  MathProblemUpdate,
  NewMathProblem,
  SelectableMathProblem,
} from './mathProblem.entity';
import { MathProblemValidator } from './mathProblem.validator';
import { MathProblemRepository } from './repository/mathProblem.repository';
import { DeleteMediaFileUsecase } from '../mediaFile/usecase/deleteMediaFile.usecase';

@Injectable()
export class MathProblemMutationService {
  constructor(
    private readonly mathProblemRepository: MathProblemRepository,
    private readonly deleteMediaFileUsecase: DeleteMediaFileUsecase,
    private readonly transactionRunner: TransactionRunner,
    private readonly mathProblemValidator: MathProblemValidator,
  ) {}

  async create(values: NewMathProblem): Promise<SelectableMathProblem> {
    this.mathProblemValidator.validateAnswers(values);
    await this.mathProblemValidator.validateImageMediaIds(values);

    const entity = await this.mathProblemRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_PROBLEM,
      );
    }

    return entity;
  }

  async bulkCreate(values: NewMathProblem[]): Promise<SelectableMathProblem[]> {
    this.mathProblemValidator.validateManyAnswers(values);
    await this.mathProblemValidator.validateManyImageMediaIds(values);

    return this.mathProblemRepository.bulkCreate(values);
  }

  async updateById(
    id: string,
    values: MathProblemUpdate,
  ): Promise<SelectableMathProblem> {
    this.mathProblemValidator.validateAnswers(values);
    await this.mathProblemValidator.validateImageMediaIds(values);

    let oldImageMediaIds: string[] | null = null;

    if (values.imageMediaIds) {
      oldImageMediaIds =
        await this.mathProblemRepository.getImageMediaIdsById(id);
    }

    return this.transactionRunner.runTransaction(async (txProvider) => {
      const entity = await this.mathProblemRepository.updateById(
        id,
        values,
        txProvider,
      );

      if (!entity) {
        throw new NotFoundException(
          ExceptionMessageCode.MATH_PROBLEM_NOT_FOUND,
        );
      }

      if (oldImageMediaIds?.length) {
        await this.deleteMediaFileUsecase.deleteManyByIds(
          oldImageMediaIds,
          txProvider,
        );
      }

      return entity;
    });
  }

  async deleteById(id: string): Promise<void> {
    const imageMediaIds =
      await this.mathProblemRepository.getImageMediaIdsById(id);

    return this.transactionRunner.runTransaction(async (txProvider) => {
      const didDelete = await this.mathProblemRepository.deleteById(
        id,
        txProvider,
      );

      if (!didDelete) {
        throw new NotFoundException(
          ExceptionMessageCode.MATH_PROBLEM_NOT_FOUND,
        );
      }

      if (imageMediaIds?.length) {
        await this.deleteMediaFileUsecase.deleteManyByIds(
          imageMediaIds,
          txProvider,
        );
      }
    });
  }
}
