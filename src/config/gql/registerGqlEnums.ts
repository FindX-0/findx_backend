import { registerEnumType } from '@nestjs/graphql';

import {
  AuthProvider,
  MatchState,
  Role,
  TicketState,
} from '@entities/entityEnums';

export const registerGqlEnums = () => {
  registerEnumType(AuthProvider, { name: 'AuthProvider' });
  registerEnumType(TicketState, { name: 'TicketState' });
  registerEnumType(MatchState, { name: 'MatchState' });
  registerEnumType(Role, { name: 'Role' });
};
