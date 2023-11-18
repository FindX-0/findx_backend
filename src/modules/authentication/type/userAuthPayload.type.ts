import { JwtPayload } from './jwtPayload.type';

export type UserAuthPayload = JwtPayload & {
  readonly issuedAt?: number;
  readonly expirationTime?: number;
};
