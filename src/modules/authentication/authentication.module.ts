import { Module } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtHelperModule } from './module/jwtHelper.module';
import { PasswordEncoder } from './util/password.encoder';
import { RandomGenerator } from '../../shared';
import { AccountVerificationModule } from '../accountVerification/accountVerification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtHelperModule, AccountVerificationModule],
  providers: [AuthenticationService, RandomGenerator, PasswordEncoder],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
