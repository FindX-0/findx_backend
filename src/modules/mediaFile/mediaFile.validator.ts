import { Injectable, NotFoundException } from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';

import { MediaFileRepository } from './mediaFile.repository';

@Injectable()
export class MediaFileValidator {
  constructor(private readonly mediaFileRepository: MediaFileRepository) {}

  async validateExistsMany(ids: string[]): Promise<void> {
    const count = await this.mediaFileRepository.countByIds(ids);

    if (count !== ids.length) {
      throw new NotFoundException(ExceptionMessageCode.MEDIA_FILE_NOT_FOUND);
    }
  }
}
