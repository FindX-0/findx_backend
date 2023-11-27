import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MediaFileDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  path: string;

  @Expose()
  fileName: string;

  @Expose()
  mimetype: string;
}
