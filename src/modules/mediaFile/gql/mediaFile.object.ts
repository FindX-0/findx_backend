import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MediaFileObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  path: string;

  @Field()
  fileName: string;

  @Field()
  mimetype: string;
}
