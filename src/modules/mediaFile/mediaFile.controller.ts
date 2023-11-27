import {
  MemoryStorageFile,
  FileInterceptor,
  UploadedFile,
} from '@blazity/nest-file-fastify';
import { Controller, Post, UseInterceptors } from '@nestjs/common';

@Controller('mediaFile')
export class MediaFileController {
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: MemoryStorageFile) {
    console.log(file);
  }

  // @Post('/upload')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'image', maxCount: 1 },
  //     { name: 'imageTwo', maxCount: 1 },
  //   ]),
  // )
  // async register(
  //   @Body() data: Record<string, unknown>, // other data that you might want to pass along with the files
  //   @UploadedFiles()
  //   files: { image?: MemoryStorageFile[0]; imageTwo?: MemoryStorageFile[0] },
  // ): Promise<void> {
  //   Object.values(files).forEach((file) => {
  //     this.s3Service.uploadFile(file[0]);
  //   });
  // }
}
