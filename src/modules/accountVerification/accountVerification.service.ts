import { Injectable, NotFoundException } from '@nestjs/common';

import { NewAccountVerification } from '@entities/accountVerification.entity';
import { ExceptionMessageCode } from '@shared/constant';

import { AccountVerificationRepository } from './accountVerification.repository';

@Injectable()
export class AccountVerificationService {
  constructor(
    private readonly accountVerificationRepository: AccountVerificationRepository,
  ) {}

  async upsert(params: NewAccountVerification) {
    const exists = await this.accountVerificationRepository.existsByUserId(
      params.userId,
    );

    if (exists) {
      await this.accountVerificationRepository.updateByUserId(
        params.userId,
        params,
      );
    }

    await this.accountVerificationRepository.create(params);
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
