import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthProvider } from '@entities/entityEnums';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  userName: string | null;

  @Field()
  createdAt: Date;

  @Field()
  isCompleted: boolean;

  @Field(() => AuthProvider)
  authProvider: AuthProvider;
}
