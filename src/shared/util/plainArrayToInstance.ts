import { ClassConstructor, plainToInstance } from 'class-transformer';

const clone = (something: any): any => {
  return JSON.parse(JSON.stringify(something));
};

export const plainArrayToInstance = <T>(
  cls: ClassConstructor<T>,
  plain: Array<any>,
): T[] => {
  return clone(plain).map((item: any) =>
    plainToInstance(cls, item || [], { enableCircularCheck: true }),
  );
};
