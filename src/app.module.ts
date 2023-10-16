import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { PostgresDialect } from 'kysely';

import { AppController } from './app.controller';
import { createPostgresPool } from './config/database.config';
import { EnvModule } from './config/env';
import { AccountVerificationModule } from './modules/accountVerification/accountVerification.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthPayloadInterceptor } from './modules/authentication/filter/authPayload.interceptor';
import { JwtAuthGuard } from './modules/authentication/filter/jwtAuth.guard';
import { JwtHelperModule } from './modules/authentication/module/jwtHelper.module';
import { VerifiedEmailValidatorGuard } from './modules/authentication/verifiedEmailValidator.guard';
import { UserModule } from './modules/user/user.module';
import { KyselyModule } from './packages/kyselyModule';

@Module({
  imports: [
    KyselyModule.forRoot({
      dialect: new PostgresDialect({
        pool: createPostgresPool(),
      }),
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
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: VerifiedEmailValidatorGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthPayloadInterceptor,
    },
  ],
})
export class AppModule {}
