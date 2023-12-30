import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MathBattleScoreChangedDto {
  @Expose()
  matchId: string;

  @Expose()
  scores: MathBattleUserScoreDto[];
}

@Exclude()
export class MathBattleUserScoreDto {
  @Expose()
  userId: string;

  @Expose()
  score: number;
}
