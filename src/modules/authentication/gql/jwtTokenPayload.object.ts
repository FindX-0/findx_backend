import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtTokenPayloadObject {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;
}
