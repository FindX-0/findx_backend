import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(validationErrors);
  }
}

const formatError = (errors: ValidationError[]) => {
  const errMsg: Record<string, unknown> = {};

  errors.forEach((error: ValidationError) => {
    errMsg[error.property] = error.children?.length
      ? [formatError(error.children)]
      : [...Object.values(error.constraints ?? {})];
  });

  return errMsg;
};

export const validationExceptionFactory = (errors: ValidationError[]) => {
  return new ValidationException(formatError(errors));
};
