import { Module } from '@nestjs/common';

import { AccountVerificationModule } from '@modules/accountVerification';
import { UserModule } from '@modules/user';
import { RandomGenerator } from '@shared/util';

import { JwtHelperModule } from './jwtHelper.module';
import { AuthenticationResolver } from '../authentication.resolver';
import { AuthenticationService } from '../authentication.service';
import { SignInWithGoogle } from '../useCase';
import { GoogleOauthHelper } from '../util/googleOauth.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Module({
  imports: [UserModule, JwtHelperModule, AccountVerificationModule],
  providers: [
    AuthenticationResolver,
    AuthenticationService,
    RandomGenerator,
    PasswordEncoder,
    GoogleOauthHelper,
    SignInWithGoogle,
  ],
})
export class AuthenticationModule {}
