import { Module } from '@nestjs/common';

import { MathProblemRepository } from './mathProblem.repository';
import { MathProblemResolver } from './mathProblem.resolver';
import { MathProblemCrudService } from './mathProblemCrud.service';

@Module({
  providers: [
    MathProblemRepository,
    MathProblemCrudService,
    MathProblemResolver,
  ],
})
export class MathProblemModule {}
