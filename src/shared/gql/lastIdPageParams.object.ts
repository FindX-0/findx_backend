import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class LastIdPageParamsObject {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastId: string | null;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Max(100)
  @Min(10)
  limit: number;
}
