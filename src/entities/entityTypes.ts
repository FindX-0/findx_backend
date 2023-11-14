import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  Gender,
  AuthProvider,
  TicketState,
  MatchState,
} from './entityEnums';

export type AccountVerification = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  isVerified: Generated<boolean>;
  oneTimeCode: number;
  userId: string;
};
export type Match = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  state: MatchState;
};
export type MathField = {
  id: Generated<string>;
  name: string;
  createdAt: Generated<Timestamp>;
};
export type MathProblem = {
  id: Generated<string>;
  difficulty: number;
  imagePaths: string[];
  text: string | null;
  tex: string | null;
  mathFieldId: string;
  mathSubFieldId: string;
};
export type MathSubField = {
  id: Generated<string>;
  name: string;
  createdAt: Generated<Timestamp>;
  mathFieldId: string;
};
export type RefreshToken = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  userId: string;
  value: string;
};
export type Ticket = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  mathConceptId: string;
  userId: string;
  state: TicketState;
  matchId: string | null;
};
export type User = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  email: string;
  userName: string | null;
  gender: Gender | null;
  passwordHash: string;
  isCompleted: Generated<boolean>;
  authProvider: Generated<AuthProvider>;
};
export type DB = {
  accountVerification: AccountVerification;
  matches: Match;
  mathFields: MathField;
  mathProblems: MathProblem;
  mathSubFields: MathSubField;
  refreshTokens: RefreshToken;
  tickets: Ticket;
  users: User;
};
