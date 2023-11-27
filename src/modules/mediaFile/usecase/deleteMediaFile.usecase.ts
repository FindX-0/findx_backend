import { unlink } from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { SelectableMediaFile } from '@entities/mediaFile.entity';
import { pathExists } from '@shared/util';

import { MediaFileRepository } from '../mediaFile.repository';

@Injectable()
export class DeleteMediaFileUsecase {
  constructor(private readonly mediaFileRepository: MediaFileRepository) {}

  async deleteById(id: string): Promise<boolean> {
    const mediaFile = await this.mediaFileRepository.getById(id);

    if (!mediaFile) {
      return false;
    }

    return this.delete(mediaFile);
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    const mediaFiles = await this.mediaFileRepository.getByIds(ids);

    return this.deleteMany(mediaFiles);
  }

  async delete({ path }: SelectableMediaFile): Promise<boolean> {
    const exists = await pathExists(path);

    if (!exists) {
      return false;
    }

    await unlink(path);

    return true;
  }

  async deleteMany(mediaFiles: SelectableMediaFile[]): Promise<void> {
    await Promise.all(
      mediaFiles.map(async ({ path }) => {
        const exists = await pathExists(path);

        if (!exists) {
          return;
        }

        await unlink(path);
      }),
    );
  }
}
