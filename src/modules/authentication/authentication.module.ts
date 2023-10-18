import { Module } from '@nestjs/common';

import { AccountVerificationModule } from '@modules/accountVerification';
import { UserModule } from '@modules/user';
import { RandomGenerator } from '@shared/util';

import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { JwtHelperModule } from './module/jwtHelper.module';
import { PasswordEncoder } from './util/password.encoder';

@Module({
  imports: [UserModule, JwtHelperModule, AccountVerificationModule],
  providers: [
    AuthenticationResolver,
    AuthenticationService,
    RandomGenerator,
    PasswordEncoder,
  ],
})
export class AuthenticationModule {}
