import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { DeleteMediaFileUsecase } from '@modules/mediaFile';
import { MediaFileValidatorService } from '@modules/mediaFile/mediaFileValidator.service';
import { ExceptionMessageCode } from '@shared/constant';
import { DataPage, LastIdPageParams } from '@shared/type';
import { TransactionRunner } from '@shared/util';

import {
  MathProblemUpdate,
  NewMathProblem,
  SelectableMathProblem,
} from './mathProblem.entity';
import { MathProblemRepository } from './mathProblem.repository';

@Injectable()
export class MathProblemCrudService {
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

  async updateById(
    id: string,
    values: MathProblemUpdate,
  ): Promise<SelectableMathProblem> {
    let oldImageMediaIds: string[] | null = null;

    if (values.imageMediaIds) {
      await this.mediaFileValidatorService.validateExistsMany(
        values.imageMediaIds,
      );

      oldImageMediaIds = await this.mathProblemRepository.getImageMediaIdsById(
        id,
      );
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

  async getById(id: string): Promise<SelectableMathProblem> {
    const entity = await this.mathProblemRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.MATH_PROBLEM_NOT_FOUND);
    }

    return entity;
  }

  async deleteById(id: string): Promise<void> {
    const imageMediaIds = await this.mathProblemRepository.getImageMediaIdsById(
      id,
    );

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

  async filter(
    filter: LastIdPageParams,
  ): Promise<DataPage<SelectableMathProblem>> {
    const data = await this.mathProblemRepository.filter(filter);

    const count = await this.mathProblemRepository.count();

    return { data, count };
  }
}
