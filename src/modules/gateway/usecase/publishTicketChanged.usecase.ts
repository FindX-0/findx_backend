import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { TicketDto } from '@modules/matchmaking/dto/ticket.dto';
import { UserQueryService } from '@modules/user/userQuery.service';

import { SelectableTicket } from '../../matchmaking/entity/ticket.entity';
import { SocketGateway } from '../gateway';
import { GatewayEvent } from '../gatewayEvent.enum';

type Args = {
  userId: string;
  ticket: SelectableTicket | null;
};

@Injectable()
export class PublishTicketChanged {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly userQueryService: UserQueryService,
  ) {}

  async call({ userId, ticket }: Args): Promise<void> {
    const socketIds = await this.userQueryService.getSocketIdById(userId);

    const mapped = plainToInstance(TicketDto, ticket);

    this.gateway.wss.to(socketIds).emit(GatewayEvent.TICKET_CHANGED, mapped);
  }
}
