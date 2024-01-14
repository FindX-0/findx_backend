import { Module } from '@nestjs/common';

import { SocketGateway } from './gateway';
import { PublishMathBattleScoreChanged } from './usecase/publishMathBattleScoreChanged.usecase';
import { PublishTicketChanged } from './usecase/publishTicketChanged.usecase';
import { PublishMathBattleResultsChanged } from './usecase/pushMathBattleResultsChanged.usecase';
import { JwtHelperModule } from '../authentication/module/jwtHelper.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtHelperModule],
  providers: [
    SocketGateway,
    // usecase
    PublishTicketChanged,
    PublishMathBattleScoreChanged,
    PublishMathBattleResultsChanged,
  ],
  exports: [
    PublishTicketChanged,
    PublishMathBattleScoreChanged,
    PublishMathBattleResultsChanged,
  ],
})
export class GatewayModule {}
