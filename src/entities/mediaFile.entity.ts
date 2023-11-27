import { Insertable, Selectable, Updateable } from 'kysely';

import { MediaFile } from './entityTypes';

export type SelectableMediaFile = Selectable<MediaFile>;
export type NewMediaFile = Insertable<MediaFile>;
export type MediaFileUpdate = Updateable<MediaFile>;
