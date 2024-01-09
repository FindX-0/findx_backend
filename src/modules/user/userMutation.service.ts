import { Injectable } from '@nestjs/common';

import { NewUser, SelectableUser } from './user.entity';
import { UserRepository } from './user.repository';
import { randomHEX } from '../../shared/util/random';

@Injectable()
export class UserMutationService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    params: Omit<NewUser, 'isOnline' | 'socketId'>,
  ): Promise<SelectableUser | null> {
    const socketId = randomHEX(32);

    return this.userRepository.createUser({
      ...params,
      socketId,
      isOnline: false,
    });
  }

  async updatePasswordById(id: string, newHashedPassword: string) {
    return this.userRepository.updatePasswordById(id, newHashedPassword);
  }

  async updateOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await this.userRepository.updateIsOnlineById(id, isOnline);
  }
}
