import { Type } from '@nestjs/common';
import { Field, ObjectType, Int } from '@nestjs/graphql';

export const DataPageObject = <T>(ItemType: Type<T>): any => {
  @ObjectType({ isAbstract: true })
  abstract class PageClass {
    @Field(() => [ItemType])
    data: T[];

    @Field(() => Int)
    count: number;
  }

  return PageClass;
};
