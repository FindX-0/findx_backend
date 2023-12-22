import { Module } from '@nestjs/common';

import { AccountVerificationModule } from '@modules/accountVerification/accountVerification.module';
import { AdminUserModule } from '@modules/adminUser/adminUser.module';
import { RefreshTokenModule } from '@modules/refreshToken/refreshToken.module';
import { UserModule } from '@modules/user/user.module';
import { RandomGenerator } from '@shared/util';

import { JwtHelperModule } from './jwtHelper.module';
import { AuthenticationResolver } from '../authentication.resolver';
import { AdminRefreshTokenUseCase } from '../useCase/adminRefreshToken.usecase';
import { AdminUserSignInUseCase } from '../useCase/adminUserSignIn.usecase';
import { AdminUserSignUpUseCase } from '../useCase/adminUserSignUp.usecase';
import { DeviceSignInUseCase } from '../useCase/deviceSignIn.usecase';
import { EmailSignInUseCase } from '../useCase/emailSignIn.usecase';
import { EmailSignUpUseCase } from '../useCase/emailSignUp.usecase';
import { GoogleSignInUseCase } from '../useCase/googleSignIn.usecase';
import { RefreshTokenUseCase } from '../useCase/refreshToken.usecase';
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
