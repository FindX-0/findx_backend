import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../../entities';

@Injectable()
export class RefreshTokenRepository {
  async createEntity(params: any): Promise<RefreshToken> {
    // return this.prismaService.refreshToken.create({ data: params });
    return null;
  }

  async getUserIdByValue(value: string): Promise<string | null> {
    // const result = await this.prismaService.refreshToken.findFirst({
    //   where: { value },
    //   select: { userId: true },
    // });

    // return result?.userId ?? null;
    return null;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    // await this.prismaService.refreshToken.deleteMany({ where: { userId } });
  }

  async deleteByValue(value: string): Promise<void> {
    // await this.prismaService.refreshToken.deleteMany({ where: { value } });
  }
}
