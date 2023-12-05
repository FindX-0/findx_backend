import { Module } from '@nestjs/common';

import { JwtHelperModule } from '@modules/authentication';
import { UserModule } from '@modules/user';

import { SocketGateway } from './gateway';

@Module({
  imports: [UserModule, JwtHelperModule],
  providers: [SocketGateway],
})
export class GatewayModule {}
