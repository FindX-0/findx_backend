import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { RefreshTokenModule } from '../refreshToken/refreshToken.module';

@Module({
  imports: [RefreshTokenModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
