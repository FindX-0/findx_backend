import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  NewUserMeta,
  SelectableUserMeta,
  UserMetaUpdate,
} from './userMeta.entity';
import { UserMetaRepository } from './userMeta.repository';
import { ExceptionMessageCode } from '../../../shared/constant';

@Injectable()
export class UserMetaMutationService {
  constructor(private readonly userMetaRepository: UserMetaRepository) {}

  async create(params: NewUserMeta): Promise<SelectableUserMeta> {
    const entity = await this.userMetaRepository.create(params);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_USER_META,
      );
    }

    return entity;
  }

  async getById(id: string): Promise<SelectableUserMeta | null> {
    const entity = await this.userMetaRepository.getById(id);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.USER_META_NOT_FOUND);
    }

    return entity;
  }

  async updateById(
    id: string,
    params: UserMetaUpdate,
  ): Promise<SelectableUserMeta | null> {
    const entity = await this.userMetaRepository.updateById(id, params);

    if (!entity) {
      throw new NotFoundException(ExceptionMessageCode.USER_META_NOT_FOUND);
    }

    return entity;
  }
}