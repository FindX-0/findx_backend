import { Injectable } from '@nestjs/common';
import { AccountVerificationParams } from './accountVerification.type';
import { DB } from '../../config';
import { InjectKysely } from '../../packages/kyselyModule';

@Injectable()
export class AccountVerificationRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async upsert(params: AccountVerificationParams) {
    // return this.prismaService.accountVerification.upsert({
    //   where: {
    //     userId: params.userId,
    //   },
    //   update: {
    //     oneTimeCode: params.oneTimeCode,
    //   },
    //   create: params,
    // });
  }

  async getByUserId(userId: string) {
    // return this.prismaService.accountVerification.findFirst({
    //   where: { userId },
    // });
  }

  async getIsVerifiedByUserId(userId: string): Promise<boolean | null> {
    // const result = await this.prismaService.accountVerification.findUnique({
    //   where: { userId },
    //   select: { isVerified: true },
    // });

    // return result?.isVerified ?? null;
    return null;
  }

  async updateIsVerified(userId: string, isVerified: boolean) {
    // return this.prismaService.accountVerification.update({
    //   where: { userId },
    //   data: { isVerified },
    // });
  }
}
