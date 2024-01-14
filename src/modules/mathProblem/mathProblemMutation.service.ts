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
import { MathProblemRepository } from './repository/mathProblem.repository';
import { MediaFileValidatorService } from '../mediaFile/mediaFileValidator.service';
import { DeleteMediaFileUsecase } from '../mediaFile/usecase/deleteMediaFile.usecase';

@Injectable()
export class MathProblemMutationService {
  constructor(
    private readonly mathProblemRepository: MathProblemRepository,
    private readonly mediaFileValidatorService: MediaFileValidatorService,
    private readonly deleteMediaFileUsecase: DeleteMediaFileUsecase,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async create(values: NewMathProblem): Promise<SelectableMathProblem> {
    if (values.imageMediaIds.length) {
      await this.mediaFileValidatorService.validateExistsMany(
        values.imageMediaIds,
      );
    }

    const entity = await this.mathProblemRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MATH_PROBLEM,
      );
    }

    return entity;
  }

  async bulkCreate(values: NewMathProblem[]): Promise<SelectableMathProblem[]> {
    const flatImageMediaIds = new Set(
      values.map((e) => e.imageMediaIds).flat(1),
    );

    if (flatImageMediaIds.size) {
      await this.mediaFileValidatorService.validateExistsMany(
        Array.from(flatImageMediaIds),
      );
    }

    return this.mathProblemRepository.bulkCreate(values);
  }

  async updateById(
    id: string,
    values: MathProblemUpdate,
  ): Promise<SelectableMathProblem> {
    let oldImageMediaIds: string[] | null = null;

    if (values.imageMediaIds) {
      await this.mediaFileValidatorService.validateExistsMany(
        values.imageMediaIds,
      );

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
