import { Module } from '@nestjs/common';

import { MathProblemResolver } from './mathProblem.resolver';
import { MathProblemValidator } from './mathProblem.validator';
import { MathProblemMutationService } from './mathProblemMutation.service';
import { MathProblemQueryService } from './mathProblemQuery.service';
import { MathProblemRepository } from './repository/mathProblem.repository';
import { CountGenerateMathProblemValues } from './usecase/countGenerateMathProblemValues.usecase';
import { GenerateMathProblemValues } from './usecase/generateMathProblemValues.usecase';
import { MathProblemAnswerGenerator } from './usecase/mathProblemAnswerGenerator';
import { AnswerFunctionModule } from '../answerFunction/answerFunction.module';
import { GetAllMathSubFieldIdsModule } from '../mathSubField/module/getAllMathSubFieldIds.module';
import { MediaFileModule } from '../mediaFile/mediaFile.module';

@Module({
  imports: [MediaFileModule, GetAllMathSubFieldIdsModule, AnswerFunctionModule],
  providers: [
    MathProblemRepository,
    MathProblemResolver,
    MathProblemQueryService,
    MathProblemMutationService,
    MathProblemValidator,
    // usecase
    GenerateMathProblemValues,
    CountGenerateMathProblemValues,
    MathProblemAnswerGenerator,
  ],
  exports: [MathProblemQueryService, MathProblemMutationService],
})
export class MathProblemModule {}
