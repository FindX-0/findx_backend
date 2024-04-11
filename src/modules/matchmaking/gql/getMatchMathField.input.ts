import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GetMatchMathFieldInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  matchId: string;
}
