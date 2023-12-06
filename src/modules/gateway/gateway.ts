import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { JwtHelper, UserAuthPayload } from '@modules/authentication';
import { UserMutationService } from '@modules/user';
import { UserQueryService } from '@modules/user/userQuery.service';

import { GatewayJwtAuthGuard } from './gatewayJwtAuth.guard';

@UseGuards(GatewayJwtAuthGuard)
@WebSocketGateway({ namespace: 'app' })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer() public wss: Server;

  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userMutationService: UserMutationService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const authPayload = this.resolveAuthPayload(client);
    if (!authPayload) {
      return;
    }

    const { userId } = authPayload;
    const userSocketId = await this.userQueryService.getSocketIdById(userId);

    await this.userMutationService.updateOnlineStatus(userId, true);

    client.join(userSocketId);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const authPayload = this.resolveAuthPayload(client);

    if (!authPayload) {
      return;
    }

    const { userId } = authPayload;

    const userSocketId = await this.userQueryService.getSocketIdById(userId);

    await this.userMutationService.updateOnlineStatus(userId, false);

    client.leave(userSocketId);
  }

  private resolveAuthPayload(client: Socket): UserAuthPayload | null {
    const token = client.handshake.auth?.['token'];
    const authPayload = this.jwtHelper.getUserPayload(token);

    return authPayload;
  }
}
