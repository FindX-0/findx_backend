import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountVerificationRepository } from './accountVerification.repository';
import { AccountVerificationParams } from './accountVerification.type';
import { ExceptionMessageCode } from '../../shared';

@Injectable()
export class AccountVerificationService {
  constructor(
    private readonly accountVerificationRepository: AccountVerificationRepository,
  ) {}

  async upsert(params: AccountVerificationParams) {
    return this.accountVerificationRepository.upsert(params);
  }

  async getByUserId(userId: string) {
    return this.accountVerificationRepository.getByUserId(userId);
  }

  async getIsVerifiedByUserId(userId: string): Promise<boolean> {
    const isVerified =
      await this.accountVerificationRepository.getIsVerifiedByUserId(userId);

    if (isVerified === undefined || isVerified === null) {
      throw new NotFoundException(
        ExceptionMessageCode.ACCOUNT_VERIFFICATION_REQUEST_NOT_FOUND,
      );
    }

    return isVerified;
  }

  async updateIsVerified(userId: string, isVerified: boolean) {
    return this.accountVerificationRepository.updateIsVerified(
      userId,
      isVerified,
    );
  }
}
