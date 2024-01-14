import { BadRequestException, Injectable } from '@nestjs/common';

import { SelectableMathProblem } from './mathProblem.entity';
import { EnvService } from '../../config/env/env.service';
import { ExceptionMessageCode } from '../../shared/constant';
import { MediaFileValidator } from '../mediaFile/mediaFile.validator';

type MathProblemAnswers = Pick<SelectableMathProblem, 'answers'>;

type MathProblemImageMediaIds = Pick<SelectableMathProblem, 'imageMediaIds'>;

@Injectable()
export class MathProblemValidator {
  constructor(
    private readonly mediaFileValidatorService: MediaFileValidator,
    private readonly envService: EnvService,
  ) {}

  async validateImageMediaIds(
    values: Partial<MathProblemImageMediaIds>,
  ): Promise<void> {
    if (!values.imageMediaIds || !values.imageMediaIds.length) {
      return;
    }

    await this.mediaFileValidatorService.validateExistsMany(
      values.imageMediaIds,
    );
  }

  async validateManyImageMediaIds(
    values: MathProblemImageMediaIds[],
  ): Promise<void> {
    if (!values.length) {
      return;
    }

    const flatImageMediaIds = new Set(
      values.map((e) => e.imageMediaIds).flat(1),
    );

    if (!flatImageMediaIds.size) {
      return;
    }

    await this.mediaFileValidatorService.validateExistsMany(
      Array.from(flatImageMediaIds),
    );
  }

  validateAnswers(values: Partial<MathProblemAnswers>): void {
    if (!values.answers) {
      return;
    }

    const answerCount = this.envService.get('MATH_PROBLEM_ANSWER_COUNT');

    if (values.answers.length !== answerCount) {
      throw new BadRequestException(ExceptionMessageCode.INVALID_ANSWER_COUNT);
    }
  }

  validateManyAnswers(values: MathProblemAnswers[]) {
    if (!values.length) {
      return;
    }

    const answerCount = this.envService.get('MATH_PROBLEM_ANSWER_COUNT');

    if (values.some((e) => e.answers.length !== answerCount)) {
      throw new BadRequestException(ExceptionMessageCode.INVALID_ANSWER_COUNT);
    }
  }
}
