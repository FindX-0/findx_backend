import { Module } from '@nestjs/common';

import { GetAllMathSubFieldIdsModule } from '@modules/mathSubField/module/getAllMathSubFieldIds.module';
import { MediaFileModule } from '@modules/mediaFile';

import { MathProblemResolver } from './mathProblem.resolver';
import { MathProblemMutationService } from './mathProblemMutation.service';
import { MathProblemQueryService } from './mathProblemQuery.service';
import { MathProblemRepository } from './repository/mathProblem.repository';
import { MathProblemIdStore } from './repository/mathProblemId.store';

@Module({
  imports: [MediaFileModule, GetAllMathSubFieldIdsModule],
  providers: [
    MathProblemRepository,
    MathProblemResolver,
    MathProblemQueryService,
    MathProblemMutationService,
    MathProblemIdStore,
  ],
  exports: [MathProblemQueryService, MathProblemMutationService],
})
export class MathProblemModule {}
