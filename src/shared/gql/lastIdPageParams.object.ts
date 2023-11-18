import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class LastIdPageParamsObject {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  lastId: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Max(100)
  @Min(10)
  limit: number;
}
