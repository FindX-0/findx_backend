import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { NewFriend, SelectableFriend } from './friend.entity';
import { FriendRepository } from './friend.repository';
import {
  AcceptFriendRequestParams,
  DeclineFriendRequestParams,
  FilterAllFriendParams as GetAllFriendParams,
  WithdrawFriendRequestParams,
} from './friend.type';
import { FriendshipStatus } from '../../entities';
import { ExceptionMessageCode } from '../../shared/constant';
import { UserValidator } from '../user/user.validator';

@Injectable()
export class FriendService {
  constructor(
    private readonly userValidator: UserValidator,
    private readonly friendRepository: FriendRepository,
  ) {}

  async create(params: Omit<NewFriend, 'status'>): Promise<SelectableFriend> {
    if (params.userId === params.friendId) {
      throw new BadRequestException(ExceptionMessageCode.CANT_FRIEND_YOURSELF);
    }

    await this.userValidator.validateExistsById(params.userId);
    await this.userValidator.validateExistsById(params.friendId);

    const existsByUserId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.userId,
        params.friendId,
      );
    const existsByFriendId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.friendId,
        params.userId,
      );

    if (existsByUserId && existsByFriendId) {
      throw new BadRequestException(ExceptionMessageCode.ALREADY_FRIENDS);
    }

    if (existsByUserId) {
      throw new BadRequestException(
        ExceptionMessageCode.FRIEND_REQUEST_ALREADY_SENT,
      );
    }

    // friend request already received and can be accepted immediatelly
    if (existsByFriendId) {
      this.friendRepository.updateByUserIdAndFriendId(
        params.friendId,
        params.userId,
        {
          status: FriendshipStatus.ACCEPTED,
        },
      );

      const entity = await this.friendRepository.create({
        ...params,
        status: FriendshipStatus.ACCEPTED,
      });

      if (!entity) {
        throw new InternalServerErrorException(
          ExceptionMessageCode.COULD_NOT_CREATE_FRIEND,
        );
      }

      return entity;
    }

    const entity = await this.friendRepository.create({
      ...params,
      status: FriendshipStatus.REQUESTED,
    });

    if (!entity) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_FRIEND,
      );
    }

    return entity;
  }

  async withdrawFriendRequest(
    params: WithdrawFriendRequestParams,
  ): Promise<void> {
    const existsByUserId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.userId,
        params.friendId,
      );

    if (!existsByUserId) {
      throw new NotFoundException(
        ExceptionMessageCode.FRIEND_REQUEST_NOT_FOUND,
      );
    }

    const existsByFriendId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.friendId,
        params.userId,
      );

    if (existsByUserId && existsByFriendId) {
      throw new BadRequestException(ExceptionMessageCode.ALREADY_FRIENDS);
    }

    await this.friendRepository.deleteByUserIdAndFriendId(
      params.userId,
      params.friendId,
    );
  }

  async declineFriendRequest(
    params: DeclineFriendRequestParams,
  ): Promise<void> {
    const existsByFriendId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.friendId,
        params.userId,
      );

    if (!existsByFriendId) {
      throw new NotFoundException(
        ExceptionMessageCode.FRIEND_REQUEST_NOT_FOUND,
      );
    }

    const existsByUserId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.userId,
        params.friendId,
      );

    if (existsByUserId && existsByFriendId) {
      throw new BadRequestException(ExceptionMessageCode.ALREADY_FRIENDS);
    }

    await this.friendRepository.deleteByUserIdAndFriendId(
      params.friendId,
      params.userId,
    );
  }

  async acceptFriendRequest(params: AcceptFriendRequestParams): Promise<void> {
    const existsByFriendId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.friendId,
        params.userId,
      );

    if (!existsByFriendId) {
      throw new NotFoundException(
        ExceptionMessageCode.FRIEND_REQUEST_NOT_FOUND,
      );
    }

    const existsByUserId =
      await this.friendRepository.existsByUserIdAndFriendId(
        params.userId,
        params.friendId,
      );

    if (existsByUserId && existsByFriendId) {
      throw new BadRequestException(ExceptionMessageCode.ALREADY_FRIENDS);
    }

    await this.friendRepository.updateByUserIdAndFriendId(
      params.friendId,
      params.userId,
      {
        status: FriendshipStatus.ACCEPTED,
      },
    );

    await this.friendRepository.create({
      userId: params.userId,
      friendId: params.friendId,
      status: FriendshipStatus.ACCEPTED,
    });
  }

  async filterFriendRequests(
    params: Omit<GetAllFriendParams, 'status'>,
  ): Promise<SelectableFriend[]> {
    const { friendId, ...restParams } = params;

    return this.friendRepository.getAll({
      ...restParams,
      friendId,
      status: FriendshipStatus.REQUESTED,
    });
  }

  async filterFriends(
    params: Omit<GetAllFriendParams, 'status'>,
  ): Promise<SelectableFriend[]> {
    const { friendId, ...restParams } = params;

    return this.friendRepository.getAll({
      ...restParams,
      friendId,
      status: FriendshipStatus.ACCEPTED,
    });
  }

  async validateFriends(userId: string, friendId: string): Promise<void> {
    const existsByUserId =
      await this.friendRepository.existsByUserIdAndFriendId(userId, friendId);

    const existsByFriendId =
      await this.friendRepository.existsByUserIdAndFriendId(friendId, userId);

    if (!existsByUserId || !existsByFriendId) {
      throw new BadRequestException(ExceptionMessageCode.NOT_FRIENDS);
    }
  }
}
