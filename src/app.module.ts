import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLFormattedError } from 'graphql';
import { PostgresDialect } from 'kysely';
import { KyselyModule } from 'nestjs-kysely';

import { RedisModule, createPostgresPool } from '@config/database';
import { EnvModule, EnvService } from '@config/env';
import { validationExceptionFactory } from '@config/validation';
import { AccountVerificationModule } from '@modules/accountVerification';
import { AdminUserModule } from '@modules/adminUser';
import {
  HttpAuthPayloadInterceptor,
  HttpJwtAuthGuard,
  JwtHelperModule,
  AuthenticationModule,
  HttpRolesGuard,
} from '@modules/authentication';
import { MatchmakingModule } from '@modules/matchmaking';
import { MathFieldModule } from '@modules/mathField';
import { MathProblemModule } from '@modules/mathProblem';
import { MathSubFieldModule } from '@modules/mathSubField';
import { MediaFileModule } from '@modules/mediaFile';
import { ServerTimeModule } from '@modules/serverTime';
import { UserModule } from '@modules/user';
import { TransactionRunnerModule } from '@shared/util';

import { AppController } from './app.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvModule.forRoot(),

    KyselyModule.forRootAsync({
      imports: [EnvModule.forRoot()],
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        return {
          dialect: new PostgresDialect({
            pool: createPostgresPool(envService),
          }),
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'gql/schema.gql'),
      formatError: (formattedError: GraphQLFormattedError) => ({
        message: formattedError.message,
      }),
    }),
    RedisModule,
    TransactionRunnerModule,

    JwtHelperModule,
    AccountVerificationModule,
    AuthenticationModule,
    UserModule,
    AdminUserModule,
    MatchmakingModule,
    ServerTimeModule,
    MathFieldModule,
    MathSubFieldModule,
    MathProblemModule,
    MediaFileModule,
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
      useClass: HttpJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: HttpRolesGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: HttpVerifiedEmailValidatorGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpAuthPayloadInterceptor,
    },
  ],
})
export class AppModule {}
