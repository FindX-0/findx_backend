import { Module } from '@nestjs/common';

import { UserMetaResolver } from './userMeta.resolver';
import { UserMetaRepository } from '../userMeta/userMeta.repository';
import { UserMetaMutationService } from '../userMeta/userMetaMutation.service';
import { UserMetaQueryService } from '../userMeta/userMetaQuery.service';

@Module({
  providers: [
    UserMetaResolver,
    UserMetaRepository,
    UserMetaMutationService,
    UserMetaQueryService,
  ],
  exports: [UserMetaMutationService, UserMetaQueryService],
})
export class UserMetaModule {}
