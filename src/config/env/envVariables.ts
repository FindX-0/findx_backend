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

  @Type(() => Number)
  @IsInt()
  PORT: number;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_HOST: string;

  @Type(() => Number)
  @IsInt()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  REDIS_HOST: string;

  @Type(() => Number)
  @IsInt()
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ADMIN_ACCESS_TOKEN_SECRET: string;

  @Type(() => Number)
  @IsInt()
  ACCESS_TOKEN_EXPIRATION: number;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  ADMIN_REFRESH_TOKEN_SECRET: string;

  @Type(() => Number)
  @IsInt()
  REFRESH_TOKEN_EXPIRATION: number;

  @Type(() => Number)
  @IsInt()
  RECOVER_PASSWORD_REQUEST_TIMEOUT_IN_MILLIS: number;

  @IsString()
  GOOGLE_OAUTH_CLIENT_ID: string;

  @Type(() => Number)
  @IsInt()
  TICKET_LIFETIME_MILLIS: number;

  @Type(() => Number)
  @IsInt()
  MATCH_LIFETIME_MILLIS: number;

  @Type(() => Number)
  @IsInt()
  MATCH_START_DELAY: number;

  @Type(() => Number)
  @IsInt()
  MATCH_CLOSE_DELAY: number;

  @Type(() => Number)
  @IsInt()
  MATCHMAKING_INTERVAL_MILLIS: number;
}
