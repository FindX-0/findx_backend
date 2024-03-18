import { NewUserMeta } from './userMeta.entity';

export type CreateUserMetaParams = Omit<
  NewUserMeta,
  'id' | 'createdAt' | 'userId'
>;
