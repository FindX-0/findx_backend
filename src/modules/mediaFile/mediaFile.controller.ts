import {
  FileInterceptor,
  UploadedFile,
  DiskStorageFile,
  UploadedFiles,
  AnyFilesInterceptor,
} from '@blazity/nest-file-fastify';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { plainArrayToInstance } from '@shared/util/plainArrayToInstance';
import { Role } from '@entities/index';

import { MediaFileDto } from './dto/mediaFile.dto';
import { PATH_UPLOADS } from './mediaFile.constant';
import { CreateMediaFileUsecase } from './usecase/createMediaFile.usecase';
import { diskStorageFileToNewMediaFileValues } from './util/disk_storage_file_to_new_media_file_values';
import { Roles } from '../authentication/decorator/roles.decorator';

@Roles(Role.SUPER_ADMIN)
@Controller('mediaFile')
export class MediaFileController {
  constructor(
    private readonly createMediaFileUsecase: CreateMediaFileUsecase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: PATH_UPLOADS }))
  async upload(@UploadedFile() file: DiskStorageFile): Promise<MediaFileDto> {
    const values = diskStorageFileToNewMediaFileValues(file);

    const mediaFile = await this.createMediaFileUsecase.create(values);

    return plainToInstance(MediaFileDto, mediaFile);
  }

  @Post('uploadMany')
  @UseInterceptors(AnyFilesInterceptor({ dest: PATH_UPLOADS }))
  async uploadMany(@UploadedFiles() files: DiskStorageFile[]) {
    const values = files.map((file) =>
      diskStorageFileToNewMediaFileValues(file),
    );

    const mediaFiles = await this.createMediaFileUsecase.createMany(values);

    return plainArrayToInstance(MediaFileDto, mediaFiles);
  }
}
