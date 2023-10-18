import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PostgresDialect } from 'kysely';

import { createPostgresPool } from '@config/database';
import { EnvModule } from '@config/env';
import { validationExceptionFactory } from '@config/validation/validationException.factory';
import { AccountVerificationModule } from '@modules/accountVerification';
import {
  GqlAuthPayloadInterceptor,
  GqlJwtAuthGuard,
  GqlVerifiedEmailValidatorGuard,
  JwtHelperModule,
  AuthenticationModule,
} from '@modules/authentication';
import { UserModule } from '@modules/user';
import { KyselyModule } from '@packages/kyselyModule';

import { AppController } from './app.controller';

@Module({
  imports: [
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
    EnvModule.forRoot(),

    JwtHelperModule,
    AccountVerificationModule,
    AuthenticationModule,
    UserModule,
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
