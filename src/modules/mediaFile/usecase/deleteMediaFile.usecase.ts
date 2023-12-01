import { unlink } from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { TransactionProvider, pathExists } from '@shared/util';

import { SelectableMediaFile } from '../mediaFile.entity';
import { MediaFileRepository } from '../mediaFile.repository';

@Injectable()
export class DeleteMediaFileUsecase {
  constructor(private readonly mediaFileRepository: MediaFileRepository) {}

  async deleteById(
    id: string,
    txProvider?: TransactionProvider,
  ): Promise<boolean> {
    const mediaFile = await this.mediaFileRepository.getById(id);

    if (!mediaFile) {
      return false;
    }

    return this.delete(mediaFile, txProvider);
  }

  async deleteManyByIds(
    ids: string[],
    txProvider?: TransactionProvider,
  ): Promise<void> {
    const mediaFiles = await this.mediaFileRepository.getByIds(ids);

    return this.deleteMany(mediaFiles, txProvider);
  }

  async delete(
    { id, path }: SelectableMediaFile,
    txProvider?: TransactionProvider,
  ): Promise<boolean> {
    const exists = await pathExists(path);

    if (!exists) {
      return false;
    }

    await unlink(path);

    await this.mediaFileRepository.deleteById(id, txProvider);

    return true;
  }

  async deleteMany(
    mediaFiles: SelectableMediaFile[],
    txProvider?: TransactionProvider,
  ): Promise<void> {
    await Promise.all(
      mediaFiles.map(async ({ path }) => {
        const exists = await pathExists(path);

        if (!exists) {
          return;
        }

        await unlink(path);
      }),
    );

    await this.mediaFileRepository.deleteManyByIds(
      mediaFiles.map((e) => e.id),
      txProvider,
    );
  }
}
