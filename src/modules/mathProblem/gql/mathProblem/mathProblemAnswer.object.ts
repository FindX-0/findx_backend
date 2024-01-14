import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MathProblemAnswerObject {
  @Field()
  tex: string;

  @Field()
  isCorrect: boolean;
}
