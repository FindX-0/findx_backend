import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import { UserRepository } from './user.repository';

@Injectable()
export class UserValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUniqueEmail(email: string) {
    const existsByEmail = await this.userRepository.existsByEmail(email);

    if (existsByEmail) {
      throw new UnauthorizedException(ExceptionMessageCode.USER_EMAIL_EXISTS);
    }
  }

  async validateExistsById(id: string): Promise<void> {
    const userExists = await this.userRepository.existsById(id);

    if (!userExists) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }
  }
}
