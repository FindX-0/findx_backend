import { Module } from '@nestjs/common';

import { AccountVerificationModule } from '@modules/accountVerification';
import { AdminUserModule } from '@modules/adminUser';
import { RefreshTokenModule } from '@modules/refreshToken';
import { UserModule } from '@modules/user';
import { RandomGenerator } from '@shared/util';

import { JwtHelperModule } from './jwtHelper.module';
import { AuthenticationResolver } from '../authentication.resolver';
import {
  AdminRefreshTokenUseCase,
  AdminUserSignUpUseCase,
  EmailSignInUseCase,
  GoogleSignInUseCase,
  RefreshTokenUseCase,
} from '../useCase';
import { AdminUserSignInUseCase } from '../useCase/adminUserSignIn.usecase';
import { DeviceSignInUseCase } from '../useCase/deviceSignIn.usecase';
import { EmailSignUpUseCase } from '../useCase/emailSignUp.usecase';
import { GoogleOauthHelper } from '../util/googleOauth.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Module({
  imports: [
    UserModule,
    JwtHelperModule,
    AccountVerificationModule,
    RefreshTokenModule,
    AdminUserModule,
  ],
  providers: [
    // resolver
    AuthenticationResolver,
    // util
    RandomGenerator,
    PasswordEncoder,
    GoogleOauthHelper,
    // usecase
    GoogleSignInUseCase,
    EmailSignUpUseCase,
    EmailSignInUseCase,
    RefreshTokenUseCase,
    AdminUserSignInUseCase,
    AdminUserSignUpUseCase,
    AdminRefreshTokenUseCase,
    DeviceSignInUseCase,
  ],
})
export class AuthenticationModule {}
