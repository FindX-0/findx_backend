import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class MathProblemAnswerObject {
  @Field()
  @IsString()
  @IsNotEmpty()
  tex: string;

  @Field()
  @IsBoolean()
  isCorrect: boolean;
}
