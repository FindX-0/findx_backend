import { Module } from '@nestjs/common';

import { MediaFileController } from './mediaFile.controller';
import { MediaFileRepository } from './mediaFile.repository';
import { MediaFileQueryService } from './mediaFileQuery.service';
import { MediaFileValidatorService } from './mediaFileValidator.service';
import { CreateMediaFileUsecase } from './usecase/createMediaFile.usecase';

@Module({
  controllers: [MediaFileController],
  providers: [
    MediaFileRepository,
    MediaFileQueryService,
    MediaFileValidatorService,
    CreateMediaFileUsecase,
  ],
  exports: [MediaFileQueryService, MediaFileValidatorService],
})
export class MediaFileModule {}
