import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { AnswerFunctionObject } from './answerFunction.object';

@ObjectType()
export class AnswerFunctionPageObject extends DataPageObject(
  AnswerFunctionObject,
) {}
