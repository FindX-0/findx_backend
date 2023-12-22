import { Insertable, Selectable, Updateable } from 'kysely';

import { Match } from '@entities/index';

export type SelectableMatch = Selectable<Match>;
export type NewMatch = Insertable<Match>;
export type MatchUpdate = Updateable<Match>;
