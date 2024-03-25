import { Injectable } from '@nestjs/common';

import { CreateUserMetaParams } from '../../userMeta/userMeta.type';
import { UserMetaMutationService } from '../../userMeta/userMetaMutation.service';
import { SelectableUserWithRelations, CreateUserParams } from '../user.type';
import { UserMutationService } from '../userMutation.service';

@Injectable()
export class CreateUser {
  constructor(
    private readonly userMutationService: UserMutationService,
    private readonly userMetaMutationService: UserMetaMutationService,
  ) {}

  async execute(params: {
    userParams: CreateUserParams;
    userMetaParams: CreateUserMetaParams;
  }): Promise<SelectableUserWithRelations> {
    const { userParams, userMetaParams } = params;

    const user = await this.userMutationService.create(userParams);

    const userMeta = await this.userMetaMutationService.create({
      ...userMetaParams,
      userId: user.id,
    });

    return { ...user, userMeta };
  }
}
