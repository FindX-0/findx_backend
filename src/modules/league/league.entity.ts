import { Insertable, Selectable, Updateable } from 'kysely';

import { League } from '../../entities';

export type SelectableLeague = Selectable<League>;
export type NewLeague = Insertable<League>;
export type LeagueUpdate = Updateable<League>;
