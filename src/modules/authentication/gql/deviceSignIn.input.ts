import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

@InputType()
export class DeviceSignInInput {
  @Field()
  @IsString()
  @MaxLength(1000)
  readonly deviceId: string;
}
