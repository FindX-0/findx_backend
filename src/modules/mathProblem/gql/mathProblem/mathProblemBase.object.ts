import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MathProblemBaseObject {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Int)
  difficulty: number;

  @Field(() => String, { nullable: true })
  text: string | null;

  @Field(() => String, { nullable: true })
  tex: string | null;

  @Field()
  mathFieldId: string;

  @Field()
  mathSubFieldId: string;

  @Field(() => String, { nullable: true })
  generatedBatchName: string | null;
}
