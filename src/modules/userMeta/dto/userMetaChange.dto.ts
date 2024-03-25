import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserMetaChangeDto {
  @Expose()
  trophyChange: number;

  @Expose()
  matchId: string;
}
