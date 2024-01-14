import { Injectable } from '@nestjs/common';

import { plainArrayToInstance } from '../../../shared/util/plainArrayToInstance';
import { MathBattleResultDto } from '../../mathBattleResult/dto/mathBattleResult.dto';
import { SelectableMathBattleResult } from '../../mathBattleResult/mathBattleResult.entity';
import { UserQueryService } from '../../user/userQuery.service';
import { SocketGateway } from '../gateway';
import { GatewayEvent } from '../gatewayEvent.enum';

type Args = {
  userIds: string[];
  results: SelectableMathBattleResult[];
};

@Injectable()
export class PublishMathBattleResultsChanged {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly userQueryService: UserQueryService,
  ) {}

  async call({ userIds, results }: Args): Promise<void> {
    const socketIds = await this.userQueryService.getSocketIds(userIds);

    const mapped = plainArrayToInstance(MathBattleResultDto, results);

    this.gateway.wss
      .to(socketIds)
      .emit(GatewayEvent.MATH_BATTLE_RESULTS_CHANGED, mapped);
  }
}

console.log('GHerllpo');
