import { Module } from '@nestjs/common';

import { SocketGateway } from './gateway';
import { PublishTicketChangedUsecase } from './usecase/publishTicketChanged.usecase';
import { JwtHelperModule } from '../authentication/module/jwtHelper.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtHelperModule],
  providers: [SocketGateway, PublishTicketChangedUsecase],
  exports: [PublishTicketChangedUsecase],
})
export class GatewayModule {}
