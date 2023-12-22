import { Exclude, Expose } from 'class-transformer';

import { TicketState } from '@entities/index';

@Exclude()
export class TicketDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  mathFieldId: string;

  @Expose()
  userId: string;

  @Expose()
  state: TicketState;

  @Expose()
  matchId: string | null;
}
