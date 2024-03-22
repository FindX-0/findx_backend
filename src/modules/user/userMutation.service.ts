import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { NewUser, SelectableUser } from './user.type';
import { ExceptionMessageCode } from '../../shared/constant';
import { randomHEX } from '../../shared/util/random';

@Injectable()
export class UserMutationService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    params: Omit<NewUser, 'isOnline' | 'socketId'>,
  ): Promise<SelectableUser> {
    const socketId = randomHEX(32);

    const entity = await this.userRepository.createUser({
      ...params,
      socketId,
      isOnline: false,
    });

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_USER,
      );
    }

    return entity;
  }

  async updatePasswordById(id: string, newHashedPassword: string) {
    return this.userRepository.updatePasswordById(id, newHashedPassword);
  }

  async updateOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await this.userRepository.updateIsOnlineById(id, isOnline);
  }
}
