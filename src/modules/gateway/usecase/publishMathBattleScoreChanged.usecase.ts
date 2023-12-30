import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { MathBattleScoreChangedDto } from '@modules/mathBattle/dto/mathBattleScoreChanged.dto';
import { UserQueryService } from '@modules/user/userQuery.service';

import { SocketGateway } from '../gateway';
import { GatewayEvent } from '../gatewayEvent.enum';

type Args = {
  userIds: string[];
  payload: {
    matchId: string;
    scores: {
      userId: string;
      score: number;
    }[];
  };
};

@Injectable()
export class PublishMathBattleScoreChanged {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly userQueryService: UserQueryService,
  ) {}

  async call({ userIds, payload }: Args): Promise<void> {
    const socketIds = await this.userQueryService.getSocketIds(userIds);

    const mapped = plainToInstance(MathBattleScoreChangedDto, payload);

    this.gateway.wss
      .to(socketIds)
      .emit(GatewayEvent.MATH_BATTLE_SCORE_CHANGED, mapped);
  }
}
