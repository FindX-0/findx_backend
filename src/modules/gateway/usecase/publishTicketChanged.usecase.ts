import { plainToInstance } from 'class-transformer';

import { TicketDto } from '@modules/matchmaking';
import { UserQueryService } from '@modules/user';

import { SocketGateway } from '../gateway';
import { GatewayEvent } from '../gatewayEvent.enum';

export class PublishTicketChangedUsecase {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly userQueryService: UserQueryService,
  ) {}

  async call({
    userId,
    ticket,
  }: {
    userId: string;
    ticket: TicketDto | null;
  }): Promise<void> {
    const socketIds = await this.userQueryService.getSocketIdById(userId);

    const mapped = plainToInstance(TicketDto, ticket);

    this.gateway.wss.to(socketIds).emit(GatewayEvent.TICKET_CHANGED, mapped);
  }
}
