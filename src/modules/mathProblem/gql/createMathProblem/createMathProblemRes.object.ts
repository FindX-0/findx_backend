import { ObjectType } from '@nestjs/graphql';

import { MathProblemBaseObject } from '../mathProblem/mathProblemBase.object';

@ObjectType()
export class CreateMathProblemResObject extends MathProblemBaseObject {}
