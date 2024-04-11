import { Module } from '@nestjs/common';

import { FriendRepository } from './friend.repository';
import { FriendController as FriendResolver } from './friend.resolver';
import { FriendService } from './friend.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [FriendResolver, FriendRepository, FriendService],
  exports: [FriendService],
})
export class FriendModule {}
