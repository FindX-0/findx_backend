import { Module } from '@nestjs/common';

import { GetAllMathSubFieldIds } from '../usecase/getAllMathSubFieldIds';

@Module({
  providers: [GetAllMathSubFieldIds],
  exports: [GetAllMathSubFieldIds],
})
export class GetAllMathSubFieldIdsModule {}
