import { Module } from '@nestjs/common';

import { MathSubFieldRepository } from './mathSubField.repository';
import { MathSubFieldResolver } from './mathSubField.resolver';
import { MathSubFieldCrudService } from './mathSubFieldCrud.service';

@Module({
  providers: [
    MathSubFieldRepository,
    MathSubFieldCrudService,
    MathSubFieldResolver,
  ],
})
export class MathSubFieldModule {}
