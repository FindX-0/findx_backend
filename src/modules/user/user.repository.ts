import { Injectable } from '@nestjs/common';
import { User } from 'src/entities';

@Injectable()
export class UserRepository {
  async getByEmail(email: string): Promise<User | null> {
    // return this.prismaService.user.findUnique({ where: { email } });
    return null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    // const count = await this.prismaService.user.count({ where: { email } });
    // return count > 0;
    return false;
  }

  async createUser(params: any): Promise<User> {
    // return this.prismaService.user.create({ data: params });
    return null;
  }

  async getById(id: string): Promise<User | null> {
    // return this.prismaService.user.findFirst({
    //   where: { id },
    //   select: {
    //     id: true,
    //     createdAt: true,
    //     userName: true,
    //     email: true,
    //     gender: true,
    //     birthDate: true,
    //     details: true,
    //     isOnline: true,
    //   },
    // });
    return null;
  }

  async getIdByEmail(email: string): Promise<number | null> {
    // const result = await this.prismaService.user.findFirst({
    //   where: { email },
    //   select: { id: true },
    // });
    // return result?.id ?? null;
    return null;
  }

  async updatePasswordById(id: string, newHashedPassword: string) {
    // return this.prismaService.user.update({
    //   where: { id },
    //   data: { passwordHash: newHashedPassword },
    // });
  }

  async existsById(id: string): Promise<boolean> {
    // const count = await this.prismaService.user.count({ where: { id } });
    // return count > 0;
    return false;
  }

  async updateById(id: string, params: any): Promise<User | null> {
    // const entity = await this.prismaService.user.findUnique({ where: { id } });
    // if (!entity) {
    //   return null;
    // }
    // return this.prismaService.user.update({
    //   where: { id },
    //   data: {
    //     ...entity,
    //     ...(params as any), //TODO fix this shit
    //   },
    // });
    return null;
  }
}
