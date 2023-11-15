import { registerEnumType } from '@nestjs/graphql';

import { AuthProvider } from '@entities/entityEnums';

export const registerGqlEnums = () => {
  registerEnumType(AuthProvider, { name: 'AuthProvider' });
};
