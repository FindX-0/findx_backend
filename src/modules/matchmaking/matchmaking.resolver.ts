import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { IdentifierInput, SuccessObject } from '@shared/gql';

import { EnqueueTicketInput } from './gql/enqueueTicket.input';
import { MatchObject } from './gql/match.object';
import { MatchQueryService } from './service/matchQuery.service';
import { EnqueueTicket } from './useCase/enqueueTicket.usecase';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Resolver()
export class MatchmakingResolver {
  constructor(
    private readonly enqueueTicketUseCase: EnqueueTicket,
    private readonly matchQueryService: MatchQueryService,
  ) {}

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

  @Query(() => MatchObject)
  async getMatchById(
    @HttpAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: IdentifierInput,
  ): Promise<MatchObject> {
    return this.matchQueryService.getById(input.id, {
      validateUserIncluded: {
        userId: authPayload.userId,
      },
    });
  }
}
