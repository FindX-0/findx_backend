import { Module } from '@nestjs/common';

import { MathSubFieldModule } from '@modules/mathSubField';

import { MathFieldRepository } from './mathField.repository';
import { MathFieldResolver } from './mathField.resolver';
import { MathFieldMutationService } from './mathFieldMutation.service';
import { MathFieldQueryService } from './mathFieldQuery.service';

@Module({
  imports: [MathSubFieldModule],
  providers: [
    MathFieldRepository,
    MathFieldQueryService,
    MathFieldMutationService,
    MathFieldResolver,
  ],
  exports: [MathFieldMutationService, MathFieldQueryService],
})
export class MathFieldModule {}
