import { Injectable } from '@nestjs/common';

import { SelectableMediaFile } from './mediaFile.entity';
import { MediaFileRepository } from './mediaFile.repository';

@Injectable()
export class MediaFileQueryService {
  constructor(private readonly mediaFileRepository: MediaFileRepository) {}

  async getByIds(ids: string[]): Promise<SelectableMediaFile[]> {
    return this.mediaFileRepository.getByIds(ids);
  }
}
