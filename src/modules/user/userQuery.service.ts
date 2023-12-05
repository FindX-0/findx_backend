import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import { SelectableUser, PublicSelectableUser } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByEmail(email: string): Promise<SelectableUser | null> {
    return this.userRepository.getByEmail(email);
  }

  async getById(id: string): Promise<PublicSelectableUser> {
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
}