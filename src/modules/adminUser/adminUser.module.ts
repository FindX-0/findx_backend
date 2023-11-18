import { Module } from '@nestjs/common';

import { AdminUserRepository } from './adminUser.repository';
import { AdminUserQueryService } from './adminUserQuery.service';
import { CreateAdminUserUseCase } from './useCase/createAdminUser.usecase';

@Module({
  providers: [
    AdminUserRepository,
    CreateAdminUserUseCase,
    AdminUserQueryService,
  ],
  exports: [CreateAdminUserUseCase, AdminUserQueryService],
})
export class AdminUserModule {}
