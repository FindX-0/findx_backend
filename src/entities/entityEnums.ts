export const AuthProvider = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  APPLE: 'APPLE',
  FACEBOOK: 'FACEBOOK',
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
export const TicketState = {
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;
export type TicketState = (typeof TicketState)[keyof typeof TicketState];
export const MatchState = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
} as const;
export type MatchState = (typeof MatchState)[keyof typeof MatchState];
