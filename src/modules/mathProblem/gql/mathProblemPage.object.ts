import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { MathProblemObject } from './mathProblem/mathProfilem.object';

@ObjectType()
export class MathProblemPageObject extends DataPageObject(MathProblemObject) {}
