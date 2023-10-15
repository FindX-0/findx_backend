import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ExceptionMessageCode, RandomGenerator } from 'src/shared';
import { User } from 'src/entities';
import { RefreshTokenRepository } from '../refreshToken/refreshToken.repository';
import { Selectable } from 'kysely';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly randomGenerator: RandomGenerator,
  ) {}

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const userId = await this.refreshTokenRepository.getUserIdByValue(
      refreshToken,
    );

    if (!userId) {
      return null;
    }

    return this.userRepository.getById(userId);
  }

  async clearRefreshTokensForUser(userId: string): Promise<void> {
    return this.refreshTokenRepository.deleteAllByUserId(userId);
  }

  async addRefreshTokenByUserId(userId: string, value: string) {
    await this.refreshTokenRepository.createEntity({
      userId,
      value,
    });
  }

  async deleteRefreshToken(refreshToken: string) {
    return this.refreshTokenRepository.deleteByValue(refreshToken);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async create(params: Omit<any, 'socketId'>): Promise<Selectable<User>> {
    const socketId = this.randomGenerator.hex(32);

    const user = await this.userRepository.createUser({ ...params, socketId });

    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
    }

    return user;
  }

  async getIdByEmail(email: string): Promise<number> {
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

  // async updateById(
  //   id: number,
  //   params: UpdateUserParams & UpdateUserDetailParams,
  // ): Promise<Omit<UserWithRelations, 'passwordHash'>> {
  //   const user = await this.userRepository.updateById(id, {
  //     userName: params.userName,
  //     birthDate: params.birthDate,
  //     gender: params.gender,
  //   });

  //   if (!user) {
  //     throw new NotFoundException(ExceptionMessageCode.USER_NOT_FOUND);
  //   }

  //   const userDetails = await this.userDetailsService.updateByUserId(id, {
  //     bio: params.bio,
  //     imagePath: params.imagePath,
  //   });

  //   return { ...user, details: userDetails };
  // }
}
