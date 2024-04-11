import { Insertable, Selectable, Updateable } from 'kysely';

import { Friend } from '@entities/index';

export type NewFriend = Insertable<Friend>;
export type FriendUpdate = Updateable<Friend>;
export type SelectableFriend = Selectable<Friend>;

export type SelectableFriendWithRelations = SelectableFriend & {
  user?: Partial<SelectableFriend> | null;
  friend?: Partial<SelectableFriend> | null;
};
