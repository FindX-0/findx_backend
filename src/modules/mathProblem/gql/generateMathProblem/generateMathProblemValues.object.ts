import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateMathProblemValuesObject {
  @Field(() => String, { nullable: true })
  correctAnswer: string | null;

  @Field()
  tex: string;
}
