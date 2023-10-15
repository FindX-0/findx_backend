export type UserAuthPayload = {
  readonly userId: string;
  readonly issuedAt?: number;
  readonly expirationTime?: number;
};
