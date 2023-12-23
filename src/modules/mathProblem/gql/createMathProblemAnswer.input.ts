import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMathProblemAnswerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  tex: string;

  @Field()
  @IsBoolean()
  isCorrect: boolean;
}
