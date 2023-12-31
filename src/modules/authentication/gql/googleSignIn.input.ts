import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GoogleSignInInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}
