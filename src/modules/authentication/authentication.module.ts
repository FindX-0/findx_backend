import { Module } from '@nestjs/common';

import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { JwtHelperModule } from './module/jwtHelper.module';
import { PasswordEncoder } from './util/password.encoder';
import { RandomGenerator } from '../../shared';
import { AccountVerificationModule } from '../accountVerification/accountVerification.module';
import { UserModule } from '../user/user.module';

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
