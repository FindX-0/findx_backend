import { Injectable, NotFoundException } from '@nestjs/common';

import { SelectableUserMeta } from './userMeta.entity';
import { UserMetaRepository } from './userMeta.repository';
import { ExceptionMessageCode } from '../../shared/constant';

@Injectable()
export class UserMetaQueryService {
  constructor(private readonly userMetaRepository: UserMetaRepository) {}

  async getByUserId(userId: string): Promise<SelectableUserMeta> {
    const entity = await this.userMetaRepository.getByUserId(userId);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.USER_META_NOT_FOUND);
    }

    return entity;
  }

  async getByUserIds(userIds: string[]): Promise<SelectableUserMeta[]> {
    return this.userMetaRepository.getByUserIds(userIds);
  }
}
