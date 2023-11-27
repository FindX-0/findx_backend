import { Module } from '@nestjs/common';

import { MediaFileController } from './mediaFile.controller';
import { MediaFileRepository } from './mediaFile.repository';
import { MediaFileCrudService } from './mediaFileCrud.service';

@Module({
  controllers: [MediaFileController],
  providers: [MediaFileRepository, MediaFileCrudService],
})
export class MediaFileModule {}
