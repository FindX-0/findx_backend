import { Module } from '@nestjs/common';

import { MathProblemIdsInit } from './bootstrap/mathProblemIds.init';
import { MathProblemResolver } from './mathProblem.resolver';
import { MathProblemMutationService } from './mathProblemMutation.service';
import { MathProblemQueryService } from './mathProblemQuery.service';
import { MathProblemRepository } from './repository/mathProblem.repository';
import { MathProblemIdStore } from './repository/mathProblemId.store';
import { GenerateMathProblems } from './usecase/generateNewMathProblemValues.usecase';
import { GetAllMathSubFieldIdsModule } from '../mathSubField/module/getAllMathSubFieldIds.module';
import { MediaFileModule } from '../mediaFile/mediaFile.module';

@Module({
  imports: [MediaFileModule, GetAllMathSubFieldIdsModule],
  providers: [
    MathProblemRepository,
    MathProblemResolver,
    MathProblemQueryService,
    MathProblemMutationService,
    MathProblemIdStore,
    MathProblemIdsInit,
    // usecase
    GenerateMathProblems,
  ],
  exports: [
    MathProblemQueryService,
    MathProblemMutationService,
    MathProblemIdStore,
  ],
})
export class MathProblemModule {}
