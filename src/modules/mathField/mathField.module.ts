import { Module } from '@nestjs/common';

import { MathFieldRepository } from './mathField.repository';
import { MathFieldResolver } from './mathField.resolver';
import { MathFieldMutationService } from './mathFieldMutation.service';
import { MathFieldQueryService } from './mathFieldQuery.service';
import { MathSubFieldModule } from '../mathSubField/module/mathSubField.module';

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
