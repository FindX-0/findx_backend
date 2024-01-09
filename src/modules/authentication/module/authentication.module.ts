import { Module } from '@nestjs/common';

import { AccountVerificationModule } from '@modules/accountVerification/accountVerification.module';
import { AdminUserModule } from '@modules/adminUser/adminUser.module';
import { RefreshTokenModule } from '@modules/refreshToken/refreshToken.module';
import { UserModule } from '@modules/user/user.module';

import { JwtHelperModule } from './jwtHelper.module';
import { AuthenticationResolver } from '../authentication.resolver';
import { AdminRefreshToken } from '../useCase/adminRefreshToken.usecase';
import { AdminUserSignIn } from '../useCase/adminUserSignIn.usecase';
import { AdminUserSignUp } from '../useCase/adminUserSignUp.usecase';
import { DeviceSignIn } from '../useCase/deviceSignIn.usecase';
import { EmailSignIn } from '../useCase/emailSignIn.usecase';
import { EmailSignUp } from '../useCase/emailSignUp.usecase';
import { GoogleSignIn } from '../useCase/googleSignIn.usecase';
import { RefreshToken } from '../useCase/refreshToken.usecase';
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
    PasswordEncoder,
    GoogleOauthHelper,
    // usecase
    GoogleSignIn,
    EmailSignUp,
    EmailSignIn,
    RefreshToken,
    AdminUserSignIn,
    AdminUserSignUp,
    AdminRefreshToken,
    DeviceSignIn,
  ],
})
export class AuthenticationModule {}
