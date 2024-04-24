import { Field, InputType } from '@nestjs/graphql';

import { LastIdPageParamsObject } from '../../../shared/gql';

@InputType()
export class FilterUsersArgs extends LastIdPageParamsObject {
  @Field(() => String, { nullable: true })
  searchQuery: string | null;
}
