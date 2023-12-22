import { Insertable, Selectable, Updateable } from 'kysely';

import { AccountVerification } from '@entities/index';

export type SelectableAccountVerification = Selectable<AccountVerification>;
export type NewAccountVerification = Insertable<AccountVerification>;
export type UpdateAccountVerification = Updateable<AccountVerification>;
