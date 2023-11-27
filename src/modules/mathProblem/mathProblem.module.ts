import { Module } from '@nestjs/common';

import { MediaFileModule } from '@modules/mediaFile';

import { MathProblemRepository } from './mathProblem.repository';
import { MathProblemResolver } from './mathProblem.resolver';
import { MathProblemCrudService } from './mathProblemCrud.service';

@Module({
  imports: [MediaFileModule],
  providers: [
    MathProblemRepository,
    MathProblemCrudService,
    MathProblemResolver,
  ],
})
export class MathProblemModule {}
