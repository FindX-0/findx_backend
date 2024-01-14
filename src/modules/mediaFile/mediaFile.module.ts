import { Module } from '@nestjs/common';

import { MediaFileController } from './mediaFile.controller';
import { MediaFileRepository } from './mediaFile.repository';
import { MediaFileValidator } from './mediaFile.validator';
import { MediaFileQueryService } from './mediaFileQuery.service';
import { CreateMediaFileUsecase } from './usecase/createMediaFile.usecase';
import { DeleteMediaFileUsecase } from './usecase/deleteMediaFile.usecase';

@Module({
  controllers: [MediaFileController],
  providers: [
    MediaFileRepository,
    MediaFileQueryService,
    MediaFileValidator,
    CreateMediaFileUsecase,
    DeleteMediaFileUsecase,
  ],
  exports: [MediaFileQueryService, MediaFileValidator, DeleteMediaFileUsecase],
})
export class MediaFileModule {}
