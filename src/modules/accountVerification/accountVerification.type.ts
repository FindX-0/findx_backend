import { AccountVerificationCode } from 'src/entities/accountVerification.entity';

export type AccountVerificationParams = Omit<
  AccountVerificationCode,
  'id' | 'createdAt' | 'isVerified'
>;
