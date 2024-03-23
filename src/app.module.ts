import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLFormattedError } from 'graphql';
import { PostgresDialect } from 'kysely';
import { KyselyModule } from 'nestjs-kysely';

import { createPostgresPool } from '@config/database/postgresPool.factory';
import { RedisModule } from '@config/database/redis.module';
import { MathBattleModule } from '@modules/mathBattle/mathBattle.module';

import { AppController } from './app.controller';
import { EnvModule } from './config/env/env.module';
import { EnvService } from './config/env/env.service';
import { validationExceptionFactory } from './config/validation';
import { AccountVerificationModule } from './modules/accountVerification/accountVerification.module';
import { AdminUserModule } from './modules/adminUser/adminUser.module';
import { AnswerFunctionModule } from './modules/answerFunction/answerFunction.module';
import { HttpAuthPayloadInterceptor } from './modules/authentication/filter/httpAuthPayload.interceptor';
import { HttpJwtAuthGuard } from './modules/authentication/filter/httpJwtAuth.guard';
import { HttpRolesGuard } from './modules/authentication/filter/httpRoles.guard';
import { AuthenticationModule } from './modules/authentication/module/authentication.module';
import { JwtHelperModule } from './modules/authentication/module/jwtHelper.module';
import { MatchmakingModule } from './modules/matchmaking/matchmaking.module';
import { MathFieldModule } from './modules/mathField/mathField.module';
import { MathProblemModule } from './modules/mathProblem/mathProblem.module';
import { MathSubFieldModule } from './modules/mathSubField/module/mathSubField.module';
import { MediaFileModule } from './modules/mediaFile/mediaFile.module';
import { ServerTimeModule } from './modules/serverTime/serverTime.module';
import { UserModule } from './modules/user/user.module';
import { TransactionRunnerModule } from './shared/util';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvModule.forRoot(),

    KyselyModule.forRootAsync({
      imports: [EnvModule.forRoot()],
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        return {
          // log: (event) => {
          //   if (event.level === 'query') {
          //     console.log(event.query.sql);
          //     console.log(event.query.parameters);
          //   }
          // },
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
    MathBattleModule,
    AnswerFunctionModule,
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
