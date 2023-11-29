import { Injectable, NotFoundException } from '@nestjs/common';

import { Role } from '@entities/entityEnums';
import { ExceptionMessageCode } from '@shared/constant';

import { SelectableAdminUser } from './adminUser.entity';
import { AdminUserRepository } from './adminUser.repository';

@Injectable()
export class AdminUserQueryService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  getByEmail(email: string): Promise<SelectableAdminUser | null> {
    return this.adminUserRepository.getByEmail(email);
  }

  getById(id: string): Promise<SelectableAdminUser | null> {
    return this.adminUserRepository.getById(id);
  }

  async getRolesById(id: string): Promise<Role[]> {
    const roles = await this.adminUserRepository.getRolesById(id);

    if (!roles) {
      throw new NotFoundException(ExceptionMessageCode.ADMIN_USER_NOT_FOUND);
    }

    return roles;
  }
}
