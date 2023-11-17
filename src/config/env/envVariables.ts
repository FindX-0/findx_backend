import { ConfigModuleOptions } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString } from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export type EnvModuleOptions = ConfigModuleOptions;

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsInt()
  @Type(() => Number)
  PORT: number;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsInt()
  @Type(() => Number)
  ACCESS_TOKEN_EXPIRATION: number;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsInt()
  @Type(() => Number)
  REFRESH_TOKEN_EXPIRATION: number;

  @IsInt()
  @Type(() => Number)
  RECOVER_PASSWORD_REQUEST_TIMEOUT_IN_MILLIS: number;

  @IsString()
  GOOGLE_OAUTH_CLIENT_ID: string;

  @IsInt()
  @Type(() => Number)
  MATCH_LIFETIME_MILLIS: number;

  @IsInt()
  @Type(() => Number)
  MATCH_START_DELAY: number;

  @IsInt()
  @Type(() => Number)
  MATCHMAKING_INTERVAL_MILLIS: number;
}
