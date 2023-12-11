import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { MatchDto, SelectableMatch } from '@modules/matchmaking';
import { UserQueryService } from '@modules/user';

import { SocketGateway } from '../gateway';
import { GatewayEvent } from '../gatewayEvent.enum';

@Injectable()
export class PublishMatchChangedUsecase {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly userQueryService: UserQueryService,
  ) {}

  async call(match: SelectableMatch): Promise<void> {
    const socketIds = await this.userQueryService.getSocketIds(match.userIds);

    const mapped = plainToInstance(MatchDto, match);

    this.gateway.wss.to(socketIds).emit(GatewayEvent.MATCH_CHANGED, mapped);
  }
}
