import { Module } from '@nestjs/common';

import { SocketGateway } from './gateway';
import { PublishMathBattleScoreChanged } from './usecase/publishMathBattleScoreChanged.usecase';
import { PublishTicketChanged } from './usecase/publishTicketChanged.usecase';
import { JwtHelperModule } from '../authentication/module/jwtHelper.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtHelperModule],
  providers: [
    SocketGateway,
    PublishTicketChanged,
    PublishMathBattleScoreChanged,
  ],
  exports: [PublishTicketChanged, PublishMathBattleScoreChanged],
})
export class GatewayModule {}
