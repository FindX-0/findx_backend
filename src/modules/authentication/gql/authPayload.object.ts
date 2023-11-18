import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayloadObject {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;

  @Field({ nullable: true })
  readonly hasEmailVerified?: boolean;
}
