import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMathFieldInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsBoolean()
  isPublic: boolean;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  spamDelayMillis: number;
}
