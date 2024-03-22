import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import { UserRepository } from './user.repository';
import { PublicSelectableUserWithRelations, SelectableUser } from './user.type';

@Injectable()
export class UserQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByEmail(email: string): Promise<SelectableUser | null> {
    return this.userRepository.getByEmail(email);
  }

  async getByDeviceId(deviceId: string): Promise<SelectableUser | null> {
    return this.userRepository.getByDeviceId(deviceId);
  }

  async getById(id: string): Promise<PublicSelectableUserWithRelations> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return user;
  }

  async getIdByEmail(email: string): Promise<string> {
    const userId = await this.userRepository.getIdByEmail(email);

    if (!userId) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return userId;
  }

  async getSocketIdById(id: string): Promise<string> {
    const socketId = await this.userRepository.getSocketIdById(id);

    if (!socketId) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return socketId;
  }

  async getSocketIds(userIds: string[]): Promise<string[]> {
    return this.userRepository.getSocketIds(userIds);
  }
}
