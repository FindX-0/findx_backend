import { Insertable, Selectable, Updateable } from 'kysely';

import { RefreshToken } from '@entities/index';

export type SelectableRefreshToken = Selectable<RefreshToken>;
export type NewRefreshToken = Insertable<RefreshToken>;
export type RefreshTokenUpdate = Updateable<RefreshToken>;
