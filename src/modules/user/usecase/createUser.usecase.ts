import { Injectable } from '@nestjs/common';

import { SelectableUserWithRelations } from '../user.entity';
import { CreateUserParams } from '../user.type';
import { CreateUserMetaParams } from '../userMeta/userMeta.type';
import { UserMetaMutationService } from '../userMeta/userMetaMutation.service';
import { UserMutationService } from '../userMutation.service';

@Injectable()
export class CreateUser {
  constructor(
    private readonly userMutationService: UserMutationService,
    private readonly userMetaMutationService: UserMetaMutationService,
  ) {}

  async execute(
    userParams: CreateUserParams & { userMeta: CreateUserMetaParams },
  ): Promise<SelectableUserWithRelations> {
    const user = await this.userMutationService.create(userParams);

    const userMeta = await this.userMetaMutationService.create({
      ...userParams.userMeta,
      userId: user.id,
    });

    return { ...user, userMeta };
  }
}
