import { Exclude, Expose } from 'class-transformer';

import { MatchState } from '@entities/entityEnums';

@Exclude()
export class MatchDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  mathFieldId: string;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;

  @Expose()
  state: MatchState;
}
