import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GqlAuthPayload, UserAuthPayload } from '@modules/authentication';

import { EnqueueTicketInput } from './gql/enqueueTicket.input';
import { EnqueueTicketUseCase } from './useCase/enqueueTicket.usecase';

@Resolver()
export class MatchmakingResolver {
  constructor(private readonly enqueueTicketUseCase: EnqueueTicketUseCase) {}

  @Mutation(() => Boolean)
  async enqueueTicket(
    @GqlAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: EnqueueTicketInput,
  ): Promise<boolean> {
    await this.enqueueTicketUseCase.call({
      userId: authPayload.userId,
      ...input,
    });

    return true;
  }
}