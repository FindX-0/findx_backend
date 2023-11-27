import { Module } from '@nestjs/common';

import { MediaFileController } from './mediaFile.controller';

@Module({
  controllers: [MediaFileController],
})
export class MediaFileModule {}
