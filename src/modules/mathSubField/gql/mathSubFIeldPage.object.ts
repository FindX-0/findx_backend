import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { MathSubFieldWithRelationsObject } from './mathSubField/mathSubFieldWithRelations.object';

@ObjectType()
export class MathSubFieldPageObject extends DataPageObject(
  MathSubFieldWithRelationsObject,
) {}
