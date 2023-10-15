import { Module } from '@nestjs/common';
import { AccountVerificationRepository } from './accountVerification.repository';
import { AccountVerificationService } from './accountVerification.service';

@Module({
  providers: [AccountVerificationService, AccountVerificationRepository],
  exports: [AccountVerificationService],
})
export class AccountVerificationModule {}
