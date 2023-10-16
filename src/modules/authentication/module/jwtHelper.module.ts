import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtHelper } from '../util/jwt.helper';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtHelper],
  exports: [JwtHelper],
})
export class JwtHelperModule {}
