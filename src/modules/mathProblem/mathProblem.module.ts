import { Module } from '@nestjs/common';

import { MediaFileModule } from '@modules/mediaFile';

import { MathProblemRepository } from './mathProblem.repository';
import { MathProblemResolver } from './mathProblem.resolver';
import { MathProblemMutationService } from './mathProblemMutation.service';
import { MathProblemQueryService } from './mathProblemQuery.service';

@Module({
  imports: [MediaFileModule],
  providers: [
    MathProblemRepository,
    MathProblemResolver,
    MathProblemQueryService,
    MathProblemMutationService,
  ],
  exports: [MathProblemQueryService, MathProblemMutationService],
})
export class MathProblemModule {}
