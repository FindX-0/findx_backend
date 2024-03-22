import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthProvider } from '@entities/index';

import { UserMetaObject } from '../../userMeta/gql/userMeta.object';

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  userName: string | null;

  @Field()
  createdAt: Date;

  @Field()
  isCompleted: boolean;

  @Field(() => AuthProvider)
  authProvider: AuthProvider;

  @Field(() => UserMetaObject, { nullable: true })
  userMeta: UserMetaObject | null;
}
