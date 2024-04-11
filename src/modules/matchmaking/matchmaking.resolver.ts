import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { IdentifierInput, SuccessObject } from '@shared/gql';

import { CancelTicketInput } from './gql/cancelTicket.input';
import { EnqueueTicketInput } from './gql/enqueueTicket.input';
import { GetMatchMathFieldInput } from './gql/getMatchMathField.input';
import { MatchObject } from './gql/match.object';
import { TicketObject } from './gql/ticket.object';
import { MatchQueryService } from './service/matchQuery.service';
import { CancelTicket } from './useCase/cancelTicket.usecase';
import { EnqueueTicket } from './useCase/enqueueTicket.usecase';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';
import { MathFieldObject } from '../mathField/gql/mathField.object';

@Resolver()
export class MatchmakingResolver {
  constructor(
    private readonly enqueueTicketUseCase: EnqueueTicket,
    private readonly matchQueryService: MatchQueryService,
    private readonly cancelTicketUsecase: CancelTicket,
  ) {}

  @Mutation(() => TicketObject)
  async enqueueTicket(
    @HttpAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: EnqueueTicketInput,
  ): Promise<TicketObject> {
    return this.enqueueTicketUseCase.call({
      userId: authPayload.userId,
      ...input,
    });
  }

  @Mutation(() => SuccessObject)
  async cancelTicket(
    @HttpAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: CancelTicketInput,
  ): Promise<SuccessObject> {
    await this.cancelTicketUsecase.call({
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

  @Query(() => MathFieldObject)
  async getMatchMathField(
    @Args('input') input: GetMatchMathFieldInput,
  ): Promise<MathFieldObject> {
    return this.matchQueryService.getMathFieldById(input.matchId);
  }
}
