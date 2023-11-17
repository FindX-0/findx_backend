import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLError } from 'graphql';
import { PostgresDialect } from 'kysely';

import { createPostgresPool } from '@config/database';
import { EnvModule } from '@config/env';
import { validationExceptionFactory } from '@config/validation';
import { AccountVerificationModule } from '@modules/accountVerification';
import {
  GqlAuthPayloadInterceptor,
  GqlJwtAuthGuard,
  GqlVerifiedEmailValidatorGuard,
  JwtHelperModule,
  AuthenticationModule,
} from '@modules/authentication';
import { MatchmakingModule } from '@modules/matchmaking';
import { ServerTimeModule } from '@modules/serverTime';
import { UserModule } from '@modules/user';
import { KyselyModule } from '@packages/kyselyModule';

import { AppController } from './app.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvModule.forRoot(),

    KyselyModule.forRoot({
      dialect: new PostgresDialect({
        pool: createPostgresPool(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'gql/schema.gql'),
      formatError: (error: GraphQLError) => ({ message: error.message }),
    }),

    JwtHelperModule,
    AccountVerificationModule,
    AuthenticationModule,
    UserModule,
    MatchmakingModule,
    ServerTimeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        exceptionFactory: validationExceptionFactory,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GqlVerifiedEmailValidatorGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GqlAuthPayloadInterceptor,
    },
  ],
})
export class AppModule {}
