import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserMetaDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  trophies: number;

  @Expose()
  userId: string;
}
