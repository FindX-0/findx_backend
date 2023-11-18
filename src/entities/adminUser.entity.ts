import { Insertable, Selectable, Updateable } from 'kysely';

import { AdminUser } from './entityTypes';

export type SelectableAdminUser = Selectable<AdminUser>;
export type NewAdminUser = Insertable<AdminUser>;
export type AdminUserUpdate = Updateable<AdminUser>;
