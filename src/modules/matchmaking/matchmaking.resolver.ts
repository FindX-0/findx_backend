import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { HttpAuthPayload, UserAuthPayload } from '@modules/authentication';
import { SuccessObject } from '@shared/gql';

import { EnqueueTicketInput } from './gql/enqueueTicket.input';
import { EnqueueTicketUseCase } from './useCase/enqueueTicket.usecase';

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
