import { Module } from '@nestjs/common';

import { JwtHelperModule } from '@modules/authentication';
import { UserModule } from '@modules/user';

import { SocketGateway } from './gateway';
import {
  PublishMatchChangedUsecase,
  PublishTicketChangedUsecase,
} from './usecase';

@Module({
  imports: [UserModule, JwtHelperModule],
  providers: [
    SocketGateway,
    PublishTicketChangedUsecase,
    PublishMatchChangedUsecase,
  ],
  exports: [PublishTicketChangedUsecase, PublishMatchChangedUsecase],
})
export class GatewayModule {}
