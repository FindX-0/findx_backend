import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { AuthProvider, TicketState, MatchState, Role } from "./entityEnums";

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
export type AnswerFunction = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    func: string;
    weight: number;
    condition: string | null;
    mathSubFieldId: string;
};
export type Match = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    startAt: Timestamp;
    endAt: Timestamp;
    closeAt: Timestamp;
    state: MatchState;
    userIds: string[];
    mathProblemIds: string[];
    mathFieldId: string;
};
export type MathBattleAnswer = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    isCorrect: boolean;
    timeSpentInMillis: Generated<number>;
    userId: string;
    mathProblemId: string;
    matchId: string;
};
export type MathBattleResult = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    score: number;
    isWinner: boolean;
    isDraw: boolean;
    matchId: string;
    userId: string;
};
export type MathField = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    name: string;
    isPublic: Generated<boolean>;
};
export type MathProblem = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    difficulty: number;
    imageMediaIds: string[];
    text: string | null;
    tex: string | null;
    answers: unknown[];
    generatedBatchName: string | null;
    meanTimeSpentInMillis: Generated<number>;
    timesAnswered: Generated<number>;
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
    value: string;
    userId: string | null;
    adminUserId: string | null;
};
export type Ticket = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    userId: string;
    state: TicketState;
    matchId: string | null;
    concurrencyTimestamp: string | null;
    mathFieldId: string;
};
export type User = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    email: string | null;
    userName: string | null;
    passwordHash: string | null;
    isCompleted: boolean;
    authProvider: AuthProvider;
    isOnline: boolean;
    socketId: string;
    deviceId: string | null;
};
export type UserMeta = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    trophies: Generated<number>;
    userId: string;
};
export type DB = {
    accountVerification: AccountVerification;
    adminUsers: AdminUser;
    answerFunctions: AnswerFunction;
    matches: Match;
    mathBattleAnswers: MathBattleAnswer;
    mathBattleResults: MathBattleResult;
    mathFields: MathField;
    mathProblems: MathProblem;
    mathSubFields: MathSubField;
    mediaFiles: MediaFile;
    refreshTokens: RefreshToken;
    tickets: Ticket;
    userMeta: UserMeta;
    users: User;
};
