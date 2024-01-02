import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MathBattleResultDto {
  @Expose()
  userId: string;

  @Expose()
  id: string;

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
}
