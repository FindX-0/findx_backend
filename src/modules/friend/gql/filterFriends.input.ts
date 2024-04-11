import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterFriendsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  searchQuery?: string;
}
