import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtHelper } from './util/jwt.helper';
import { RandomGenerator } from '../../shared';
import { JwtHelperModule } from './module/jwtHelper.module';
import { PasswordEncoder } from './util/password.encoder';
import { AccountVerificationModule } from '../accountVerification/accountVerification.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [UserModule, JwtHelperModule, AccountVerificationModule],
  providers: [AuthenticationService, RandomGenerator, PasswordEncoder],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
