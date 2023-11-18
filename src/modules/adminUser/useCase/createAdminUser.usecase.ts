import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { NewAdminUser, SelectableAdminUser } from '@entities/adminUser.entity';
import { ExceptionMessageCode } from '@shared/constant';

import { AdminUserRepository } from '../adminUser.repository';

@Injectable()
export class CreateAdminUserUseCase {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async call(values: NewAdminUser): Promise<SelectableAdminUser> {
    const existsByEmail = await this.adminUserRepository.existsByEmail(
      values.email,
    );

    if (existsByEmail) {
      throw new ConflictException(ExceptionMessageCode.ADMIN_USER_EMAIL_EXISTS);
    }

    const entity = await this.adminUserRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_ADMIN_USER,
      );
    }

    return entity;
  }
}
