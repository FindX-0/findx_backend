import { SetMetadata } from '@nestjs/common';

export const NO_EMAIL_VERIFICATION_VALIDATE = 'no_email_verification_validate';
export const NoEmailVerificationValidate = () =>
  SetMetadata(NO_EMAIL_VERIFICATION_VALIDATE, true);
