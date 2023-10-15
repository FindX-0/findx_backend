import { Insertable, Selectable, Updateable } from 'kysely';
import { AccountVerification } from './entityTypes';

export type SelectableAccountVerification = Selectable<AccountVerification>;
export type NewAccountVerification = Insertable<AccountVerification>;
export type AccountVerificationUpdate = Updateable<AccountVerification>;
