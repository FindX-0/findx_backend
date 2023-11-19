import { Injectable, NotFoundException } from '@nestjs/common';

import {
  NewUser,
  SelectableUser,
  SelectableUserOmitPassword,
} from '@entities/user.entity';
import { ExceptionMessageCode } from '@shared/constant';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByEmail(email: string): Promise<SelectableUser | null> {
    return this.userRepository.getByEmail(email);
  }

  async create(params: NewUser): Promise<SelectableUser | null> {
    return this.userRepository.createUser(params);
  }

  async getById(id: string): Promise<SelectableUserOmitPassword> {
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

  async updatePasswordById(id: string, newHashedPassword: string) {
    return this.userRepository.updatePasswordById(id, newHashedPassword);
  }

  async validateUserById(id: string): Promise<void> {
    const userExists = await this.userRepository.existsById(id);

    if (!userExists) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }
  }
}
