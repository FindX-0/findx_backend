import { Field, ObjectType } from '@nestjs/graphql';

import { MathFieldObject } from '@modules/mathField/gql/mathField.object';

import { MathSubFieldObject } from './mathSubField.object copy';

@ObjectType()
export class MathSubFieldWithRelationsObject extends MathSubFieldObject {
  @Field(() => MathFieldObject, { nullable: true })
  mathField?: MathFieldObject | null;
}
