import { Module } from '@nestjs/common';

import { ServerTimeResolver } from './serverTime.resolver';

@Module({
  providers: [ServerTimeResolver],
})
export class ServerTimeModule {}
