import { NewUser } from './user.entity';

export type CreateUserParams = Omit<NewUser, 'isOnline' | 'socketId'>;
