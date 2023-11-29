import { Insertable, Selectable, Updateable } from 'kysely';

import { AccountVerification } from '@entities/entityTypes';

export type SelectableAccountVerification = Selectable<AccountVerification>;
export type NewAccountVerification = Insertable<AccountVerification>;
export type UpdateAccountVerification = Updateable<AccountVerification>;
