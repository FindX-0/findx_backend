import { Module } from '@nestjs/common';

import { AnswerFunctionRepository } from './answerFunction.repository';
import { AnswerFunctionResolver } from './answerFunction.resolver';
import { AnswerFunctionMutationService } from './answerFunctionMutation.service';
import { AnswerFunctionQueryService } from './answerFunctionQuery.service';
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
  ],
  exports: [AnswerFunctionMutationService, AnswerFunctionQueryService],
})
export class AnswerFunctionModule {}
