import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SuccessObject } from '@shared/gql';

import { EnqueueTicketInput } from './gql/enqueueTicket.input';
import { EnqueueTicketUseCase } from './useCase/enqueueTicket.usecase';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Resolver()
export class MatchmakingResolver {
  constructor(private readonly enqueueTicketUseCase: EnqueueTicketUseCase) {}

  @Mutation(() => SuccessObject)
  async enqueueTicket(
    @HttpAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: EnqueueTicketInput,
  ): Promise<SuccessObject> {
    await this.enqueueTicketUseCase.call({
      userId: authPayload.userId,
      ...input,
    });

    return { success: true };
  }
}
