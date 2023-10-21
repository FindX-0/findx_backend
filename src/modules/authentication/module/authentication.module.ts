import { Module } from '@nestjs/common';

import { AccountVerificationModule } from '@modules/accountVerification';
import { UserModule } from '@modules/user';
import { RandomGenerator } from '@shared/util';

import { JwtHelperModule } from './jwtHelper.module';
import { AuthenticationResolver } from '../authentication.resolver';
import {
  EmailSignInUseCase,
  GoogleSignInUseCase,
  RefreshTokenUseCase,
} from '../useCase';
import { EmailSignUpUseCase } from '../useCase/emailSignUp.usecase';
import { GoogleOauthHelper } from '../util/googleOauth.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Module({
  imports: [UserModule, JwtHelperModule, AccountVerificationModule],
  providers: [
    AuthenticationResolver,
    RandomGenerator,
    PasswordEncoder,
    GoogleOauthHelper,
    GoogleSignInUseCase,
    EmailSignUpUseCase,
    EmailSignInUseCase,
    RefreshTokenUseCase,
  ],
})
export class AuthenticationModule {}
