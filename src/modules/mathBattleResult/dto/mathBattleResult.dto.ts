import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MathBattleResultDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  score: number;

  @Expose()
  isWinner: boolean;

  @Expose()
  isDraw: boolean;

  @Expose()
  matchId: string;

  @Expose()
  trophyChange: number;
}
