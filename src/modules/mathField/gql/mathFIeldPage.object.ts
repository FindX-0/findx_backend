import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { MathFieldObject } from './mathField.object';

@ObjectType()
export class MathFieldPageObject extends DataPageObject(MathFieldObject) {}
