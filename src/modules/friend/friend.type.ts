import { FriendshipStatus } from '../../entities';

type UserIdAndFriendId = {
  readonly userId: string;
  readonly friendId: string;
};

export type WithdrawFriendRequestParams = UserIdAndFriendId;

export type DeclineFriendRequestParams = UserIdAndFriendId;

export type AcceptFriendRequestParams = UserIdAndFriendId;

export type FilterAllFriendParams = {
  friendId: string;
  status?: FriendshipStatus;
  searchQuery?: string;
};
