import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FriendService } from './friend.service';
import { AcceptFriendRequestInput } from './gql/acceptFriendRequest.input';
import { DeclineFriendRequestInput } from './gql/declineFriendRequest.input';
import { FilterFriendsInput } from './gql/filterFriends.input';
import { FriendObject } from './gql/friend/friend.object';
import { SendFriendRequestInput } from './gql/sendFriendRequest.input';
import { WithdrawFriendRequestInput } from './gql/withdrawFriendRequest.input';
import { SuccessObject } from '../../shared/gql';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Resolver()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Mutation(() => FriendObject)
  async sendFriendRequest(
    @Args('input') input: SendFriendRequestInput,
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<FriendObject> {
    return this.friendService.create({
      userId: authPayload.userId,
      friendId: input.userId,
    });
  }

  @Mutation(() => SuccessObject)
  async withdrawFriendRequest(
    @Args('input') input: WithdrawFriendRequestInput,
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<SuccessObject> {
    await this.friendService.withdrawFriendRequest({
      friendId: input.userId,
      userId: authPayload.userId,
    });

    return { success: true };
  }

  @Mutation(() => SuccessObject)
  async declineFriendRequest(
    @Args('input') input: DeclineFriendRequestInput,
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<SuccessObject> {
    await this.friendService.declineFriendRequest({
      friendId: input.userId,
      userId: authPayload.userId,
    });

    return { success: true };
  }

  @Mutation(() => SuccessObject)
  async acceptFriendRequest(
    @Args('input') input: AcceptFriendRequestInput,
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<SuccessObject> {
    await this.friendService.acceptFriendRequest({
      friendId: input.userId,

      userId: authPayload.userId,
    });

    return { success: true };
  }

  @Query(() => [FriendObject])
  async getFriendRequests(
    @Args('input') input: FilterFriendsInput,
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<FriendObject[]> {
    return this.friendService.filterFriendRequests({
      ...input,
      friendId: authPayload.userId,
    });
  }

  @Query(() => [FriendObject])
  async getFriends(
    @Args('input') input: FilterFriendsInput,
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<FriendObject[]> {
    return this.friendService.filterFriends({
      ...input,
      friendId: authPayload.userId,
    });
  }
}
