import { registerEnumType } from '@nestjs/graphql';

import { AuthProvider, Gender } from '@entities/entityEnums';

export const registerGqlEnums = () => {
  registerEnumType(Gender, { name: 'Gender' });
  registerEnumType(AuthProvider, { name: 'AuthProvider' });
};
