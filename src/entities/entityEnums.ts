export const AuthProvider = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
    APPLE: "APPLE",
    FACEBOOK: "FACEBOOK",
    NONE: "NONE"
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
export const TicketState = {
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    EXPIRED: "EXPIRED"
} as const;
export type TicketState = (typeof TicketState)[keyof typeof TicketState];
export const MatchState = {
    IN_PROGRESS: "IN_PROGRESS",
    FINISHED: "FINISHED"
} as const;
export type MatchState = (typeof MatchState)[keyof typeof MatchState];
export const Role = {
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const FriendshipStatus = {
    REQUESTED: "REQUESTED",
    ACCEPTED: "ACCEPTED"
} as const;
export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus];
