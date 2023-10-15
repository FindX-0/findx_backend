import { Module } from '@nestjs/common';
import { JwtHelper } from '../util/jwt.helper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtHelper],
  exports: [JwtHelper],
})
export class JwtHelperModule {}
