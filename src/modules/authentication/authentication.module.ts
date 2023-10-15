import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtHelper } from './util/jwt.helper';
import { RandomGenerator } from 'src/shared';
import { JwtHelperModule } from './module/jwtHelper.module';

@Module({
  imports: [UserModule, JwtHelperModule],
  providers: [AuthenticationService, JwtHelper, RandomGenerator],
})
export class AuthenticationModule {}
