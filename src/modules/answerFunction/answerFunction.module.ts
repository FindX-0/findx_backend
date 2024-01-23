import { Module } from '@nestjs/common';

import { AnswerFunctionRepository } from './answerFunction.repository';
import { AnswerFunctionResolver } from './answerFunction.resolver';
import { AnswerFunctionMutationService } from './answerFunctionMutation.service';
import { AnswerFunctionQueryService } from './answerFunctionQuery.service';

@Module({
  providers: [
    AnswerFunctionRepository,
    AnswerFunctionQueryService,
    AnswerFunctionMutationService,
    AnswerFunctionResolver,
  ],
  exports: [AnswerFunctionMutationService, AnswerFunctionQueryService],
})
export class AnswerFunctionModule {}
