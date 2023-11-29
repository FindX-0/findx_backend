import { ValidationOptions, registerDecorator } from 'class-validator';

import { RegexConstant } from '@shared/constant/regex.constant';

export const IsEmailCustom = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEmailCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Email is invalid',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && RegexConstant.EMAIL.test(value);
        },
      },
    });
  };
};
