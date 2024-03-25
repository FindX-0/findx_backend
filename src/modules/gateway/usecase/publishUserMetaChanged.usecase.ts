import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserQueryService } from '@modules/user/userQuery.service';

import { UserMetaDto } from '../../userMeta/dto/userMeta.dto';
import { UserMetaChangeDto } from '../../userMeta/dto/userMetaChange.dto';
import {
  SelectableUserMeta,
  UserMetaChange,
} from '../../userMeta/userMeta.entity';
import { SocketGateway } from '../gateway';
import { GatewayEvent } from '../gatewayEvent.enum';

type Args = {
  userId: string;
  payload: { userMeta: SelectableUserMeta; userMetaChange: UserMetaChange };
};

@Injectable()
export class PublishUserMetaChanged {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly userQueryService: UserQueryService,
  ) {}

  async call({ userId, payload }: Args): Promise<void> {
    const socketIds = await this.userQueryService.getSocketIdById(userId);

    const mapped = {
      userMeta: plainToInstance(UserMetaDto, payload.userMeta),
      userMetaChange: plainToInstance(
        UserMetaChangeDto,
        payload.userMetaChange,
      ),
    };

    this.gateway.wss.to(socketIds).emit(GatewayEvent.USER_META_CHANGED, mapped);
  }
}
