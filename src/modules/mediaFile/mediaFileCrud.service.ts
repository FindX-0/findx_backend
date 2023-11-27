import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { NewMediaFile, SelectableMediaFile } from '@entities/mediaFile.entity';
import { ExceptionMessageCode } from '@shared/constant';

import { MediaFileRepository } from './mediaFile.repository';

@Injectable()
export class MediaFileCrudService {
  constructor(private readonly mediaFileRepository: MediaFileRepository) {}

  async create(values: NewMediaFile): Promise<SelectableMediaFile> {
    const entity = await this.mediaFileRepository.create(values);

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_MEDIA_FILE,
      );
    }

    return entity;
  }

  async createMany(values: NewMediaFile[]): Promise<SelectableMediaFile[]> {
    return this.mediaFileRepository.createMany(values);
  }
}
