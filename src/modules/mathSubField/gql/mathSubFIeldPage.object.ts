import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { MathSubFieldObject } from './mathSubField.object';

@ObjectType()
export class MathSubFieldPageObject extends DataPageObject(
  MathSubFieldObject,
) {}
