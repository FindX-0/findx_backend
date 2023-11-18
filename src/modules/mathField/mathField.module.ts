import { Module } from '@nestjs/common';

import { MathFieldRepository } from './mathField.repository';
import { MathFieldResolver } from './mathField.resolver';
import { MathFieldCrudService } from './mathFieldCrud.service';

@Module({
  providers: [MathFieldRepository, MathFieldCrudService, MathFieldResolver],
})
export class MathFieldModule {}
