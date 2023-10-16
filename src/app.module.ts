import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PostgresDialect } from 'kysely';

import { validationExceptionFactory } from '@config/validationException.factory';

import { AppController } from './app.controller';
import { createPostgresPool } from './config/database.config';
import { EnvModule } from './config/env';
import { AccountVerificationModule } from './modules/accountVerification/accountVerification.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GqlAuthPayloadInterceptor } from './modules/authentication/filter/gqlAuthPayload.interceptor';
import { GqlJwtAuthGuard } from './modules/authentication/filter/gqlJwtAuth.guard';
import { GqlVerifiedEmailValidatorGuard } from './modules/authentication/filter/gqlVerifiedEmailValidator.guard';
import { JwtHelperModule } from './modules/authentication/module/jwtHelper.module';
import { UserModule } from './modules/user/user.module';
import { KyselyModule } from './packages/kyselyModule';

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
