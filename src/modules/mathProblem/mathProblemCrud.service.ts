import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  MathProblemUpdate,
  NewMathProblem,
  SelectableMathProblem,
} from '@entities/mathProblem.entity';
import { DeleteMediaFileUsecase } from '@modules/mediaFile';
import { MediaFileValidatorService } from '@modules/mediaFile/mediaFileValidator.service';
import { ExceptionMessageCode } from '@shared/constant';
import { DataPage, LastIdPageParams } from '@shared/type';

import { MathProblemRepository } from './mathProblem.repository';

@Injectable()
export class MathProblemCrudService {
  constructor(
    private readonly mathProblemRepository: MathProblemRepository,
    private readonly mediaFileValidatorService: MediaFileValidatorService,
    private readonly deleteMediaFileUsecase: DeleteMediaFileUsecase,
  ) {}

  async create(values: NewMathProblem): Promise<SelectableMathProblem> {
    await this.mediaFileValidatorService.validateExistsMany(
      values.imageMediaIds,
    );

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

    const entity = await this.mathProblemRepository.updateById(id, values);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.MATH_PROBLEM_NOT_FOUND);
    }

    if (oldImageMediaIds?.length) {
      await this.deleteMediaFileUsecase.deleteManyByIds(oldImageMediaIds);
    }

    return entity;
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

    const didDelete = await this.mathProblemRepository.deleteById(id);

    if (!didDelete) {
      throw new NotFoundException(ExceptionMessageCode.MATH_PROBLEM_NOT_FOUND);
    }

    if (imageMediaIds?.length) {
      await this.deleteMediaFileUsecase.deleteManyByIds(imageMediaIds);
    }
  }

  async filter(
    filter: LastIdPageParams,
  ): Promise<DataPage<SelectableMathProblem>> {
    const data = await this.mathProblemRepository.filter(filter);

    const count = await this.mathProblemRepository.count();

    return { data, count };
  }
}
