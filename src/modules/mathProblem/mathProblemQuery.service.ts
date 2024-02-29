import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { DataPage } from '@shared/type';

import {
  SelectableMathProblem,
  SelectableMathProblemWRelations,
} from './mathProblem.entity';
import {
  CountMathProblemParams,
  FilterMathProblemParams,
} from './mathProblem.type';
import { MathProblemRepository } from './repository/mathProblem.repository';
import { MediaFileQueryService } from '../mediaFile/mediaFileQuery.service';

@Injectable()
export class MathProblemQueryService {
  constructor(
    private readonly mathProblemRepository: MathProblemRepository,
    private readonly mediaFileQueryService: MediaFileQueryService,
  ) {}

  async getById(id: string): Promise<SelectableMathProblem> {
    const entity = await this.mathProblemRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.MATH_PROBLEM_NOT_FOUND);
    }

    return entity;
  }

  async filter(
    filter: FilterMathProblemParams,
  ): Promise<DataPage<SelectableMathProblemWRelations>> {
    const count = await this.mathProblemRepository.count(filter);

    if (count == 0) {
      return { data: [], count };
    }

    const data = await this.mathProblemRepository.filter(filter);

    const imageMediaIds = data.map((e) => e.imageMediaIds).flat(1);

    const imageMediaFiles =
      await this.mediaFileQueryService.getByIds(imageMediaIds);

    const joinedDataWithMediaFiles = data.map((e) => {
      const images = imageMediaFiles.filter(
        (mediaFile) => e.imageMediaIds?.includes(mediaFile.id),
      );

      return { ...e, images };
    });

    return { data: joinedDataWithMediaFiles, count };
  }

  async countBy(params: CountMathProblemParams): Promise<number> {
    return this.mathProblemRepository.count(params);
  }

  async getByIds(ids: string[]): Promise<SelectableMathProblem[]> {
    if (!ids.length) {
      return [];
    }

    return this.mathProblemRepository.getByIds(ids);
  }

  async getRandomIds({
    maxCount,
    mathSubFieldId,
    difficultyRange,
  }: {
    maxCount: number;
    mathSubFieldId: string;
    difficultyRange: [number, number];
  }): Promise<string[]> {
    return this.mathProblemRepository.getRandomIds({
      maxCount,
      mathSubFieldId,
      difficultyRange,
    });
  }
}
