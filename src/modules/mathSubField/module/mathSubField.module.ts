import { Module } from '@nestjs/common';

import { MathProblemModule } from '@modules/mathProblem';

import { MathSubFieldRepository } from '../mathSubField.repository';
import { MathSubFieldResolver } from '../mathSubField.resolver';
import { MathSubFieldMutationService } from '../mathSubFieldMutation.service';
import { MathSubFieldQueryService } from '../mathSubFieldQuery.service';

@Module({
  imports: [MathProblemModule],
  providers: [
    MathSubFieldRepository,
    MathSubFieldMutationService,
    MathSubFieldQueryService,
    MathSubFieldResolver,
  ],
  exports: [MathSubFieldMutationService, MathSubFieldQueryService],
})
export class MathSubFieldModule {}
