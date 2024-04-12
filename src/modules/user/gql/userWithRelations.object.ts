import { Field, ObjectType } from '@nestjs/graphql';

import { UserObject } from './user.object';
import { UserMetaObject } from '../../userMeta/gql/userMeta.object';

@ObjectType()
export class UserWithRelationsObject extends UserObject {
  @Field(() => UserMetaObject, { nullable: true })
  userMeta: UserMetaObject | null;
}
