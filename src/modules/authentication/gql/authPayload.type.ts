import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayloadResponseType {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;

  @Field({ nullable: true })
  readonly hasEmailVerified?: boolean;
}
