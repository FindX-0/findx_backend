import { registerEnumType } from '@nestjs/graphql';

import { AuthProvider, MatchState, TicketState } from '@entities/entityEnums';

export const registerGqlEnums = () => {
  registerEnumType(AuthProvider, { name: 'AuthProvider' });
  registerEnumType(TicketState, { name: 'TicketState' });
  registerEnumType(MatchState, { name: 'MatchState' });
};
