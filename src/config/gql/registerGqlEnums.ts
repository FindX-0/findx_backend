import { registerEnumType } from '@nestjs/graphql';

import {
  AuthProvider,
  FriendshipStatus,
  MatchState,
  Role,
  TicketState,
} from '@entities/index';

export const registerGqlEnums = () => {
  registerEnumType(AuthProvider, { name: 'AuthProvider' });
  registerEnumType(TicketState, { name: 'TicketState' });
  registerEnumType(MatchState, { name: 'MatchState' });
  registerEnumType(Role, { name: 'Role' });
  registerEnumType(FriendshipStatus, { name: 'FriendshipStatus' });
};
