import { Module } from '@nestjs/common';

import { AnswerFunctionRepository } from './answerFunction.repository';
import { AnswerFunctionResolver } from './answerFunction.resolver';
import { AnswerFunctionMutationService } from './answerFunctionMutation.service';
import { AnswerFunctionQueryService } from './answerFunctionQuery.service';
import { AnswerFunctionFunc } from './usecase/answerFunctionFunc';
import { NormalizeAnswerFunctionWeight } from './usecase/normalizeAnswerFunctionWeight.usecase';
import { AdminUserModule } from '../adminUser/adminUser.module';

@Module({
  imports: [AdminUserModule],
  providers: [
    AnswerFunctionRepository,
    AnswerFunctionQueryService,
    AnswerFunctionMutationService,
    AnswerFunctionResolver,
    // usecase
    NormalizeAnswerFunctionWeight,
    AnswerFunctionFunc,
  ],
  exports: [
    AnswerFunctionMutationService,
    AnswerFunctionQueryService,
    AnswerFunctionFunc,
  ],
})
export class AnswerFunctionModule {}
