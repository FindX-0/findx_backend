import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'AuthPayloadResponse' })
export class AuthPayloadResponseDto {
  @Field(() => ID)
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;

  @Field({ nullable: true })
  readonly hasEmailVerified?: boolean;
}
