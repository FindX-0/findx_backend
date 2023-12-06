import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  AuthProvider,
  TicketState,
  MatchState,
  Role,
} from './entityEnums';

export type AccountVerification = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  isVerified: boolean;
  oneTimeCode: number;
  userId: string;
};
export type AdminUser = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  userName: string;
  email: string;
  passwordHash: string;
  roles: Role[];
};
export type Match = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  startAt: Timestamp;
  endAt: Timestamp;
  state: MatchState;
  mathFieldId: string;
};
export type MathField = {
  id: Generated<string>;
  name: string;
  createdAt: Generated<Timestamp>;
  isPublic: Generated<boolean>;
};
export type MathProblem = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  difficulty: number;
  imageMediaIds: string[];
  text: string | null;
  tex: string | null;
  mathFieldId: string;
  mathSubFieldId: string;
};
export type MathSubField = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  name: string;
  mathFieldId: string;
};
export type MediaFile = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  path: string;
  fileName: string;
  mimetype: string;
};
export type RefreshToken = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  userId: string | null;
  adminUserId: string | null;
  value: string;
};
export type Ticket = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  mathFieldId: string;
  userId: string;
  state: TicketState;
  matchId: string | null;
};
export type User = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  email: string;
  userName: string | null;
  passwordHash: string;
  isCompleted: boolean;
  authProvider: Generated<AuthProvider>;
  isOnline: boolean;
  socketId: string;
};
export type DB = {
  accountVerification: AccountVerification;
  adminUsers: AdminUser;
  matches: Match;
  mathFields: MathField;
  mathProblems: MathProblem;
  mathSubFields: MathSubField;
  mediaFiles: MediaFile;
  refreshTokens: RefreshToken;
  tickets: Ticket;
  users: User;
};
