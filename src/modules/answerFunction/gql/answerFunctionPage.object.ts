import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { AnswerFunctionWithRelations } from './answerFunction/answerFunctionWithRelations.object';

@ObjectType()
export class AnswerFunctionPageObject extends DataPageObject(
  AnswerFunctionWithRelations,
) {}
