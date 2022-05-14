import { UserNotFound } from '@warpy-be/errors';
import { ParticipantStore } from '@warpy-be/user/participant/store';
import { Injectable } from '@nestjs/common';
import {
  INewUser,
  INewUserResponse,
  IUser,
  IUserInfoResponse,
  IWhoAmIResponse,
} from '@warpy/lib';
import { RefreshTokenEntity } from '../token/refresh-token.entity';
import { TokenService } from '../token/token.service';
import { UserOnlineStatusService } from './online-status/user-online-status.service';
import { UserEntity } from './user.entity';
import { FollowEntity } from './follow/follow.entity';
import { AppInviteEntity } from './app_invite/app-invite.entity';
import { AppliedAppInviteEntity } from './app_invite/applied-app-invite.entity';
import { CategoriesEntity } from '@warpy-be/stream/categories/categories.entity';
import { StreamEntity } from '@warpy-be/stream/common/stream.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_USER_CREATED } from '@warpy-be/utils';
import { BlockEntity } from '@warpy-be/block/block.entity';

@Injectable()
export class UserService {
  constructor(
    private categoriesEntity: CategoriesEntity,
    private user: UserEntity,
    private tokenService: TokenService,
    private refreshTokenEntity: RefreshTokenEntity,
    private followEntity: FollowEntity,
    private participantEntity: ParticipantStore,
    private streamEntity: StreamEntity,
    private blockEntity: BlockEntity,
    private appInviteEntity: AppInviteEntity,
    private appliedAppInviteEntity: AppliedAppInviteEntity,
    private userOnlineStatusService: UserOnlineStatusService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createAnonUser() {
    const anonUserId = await this.user.createAnonUser();

    const accessToken = this.tokenService.createAuthToken(
      anonUserId,
      false,
      '1d',
    );

    return {
      id: anonUserId,
      access: accessToken,
    };
  }

  async findById(user: string, details?: boolean) {
    return this.user.findById(user, details);
  }

  async getUserInfo(id: string, requester: string): Promise<IUserInfoResponse> {
    const [user, currentStreamId, isFollowed, isFollower] = await Promise.all([
      this.user.findById(id, false),
      this.participantEntity.getStreamId(id),
      this.followEntity.isFollowing(requester, id),
      this.followEntity.isFollowing(id, requester),
    ]);

    const response = {
      user,
      isFollowed,
      isFollower,
    };

    if (currentStreamId) {
      const stream = await this.streamEntity.findById(currentStreamId);

      console.log({ currentStreamId, stream });

      if (stream) {
        response['stream'] = {
          title: stream.title,
          id: stream.id,
          participants: await this.participantEntity.count(currentStreamId),
        };
      }
    }

    return response as any;
  }

  async search(text: string): Promise<IUser[]> {
    return this.user.search(text);
  }

  async update(user: string, params: Partial<IUser>) {
    await this.user.update(user, params);
  }

  async get(user: string): Promise<IUser> {
    return this.user.findById(user);
  }

  async createDevUser(data: INewUser): Promise<INewUserResponse> {
    const { username, avatar, last_name, first_name, email } = data;

    const user = await this.user.createNewUser({
      username,
      last_name,
      first_name,
      email,
      avatar,
      sub: 'DEV_ACCOUNT',
      is_anon: false,
    });

    const accessToken = this.tokenService.createAuthToken(user.id, false, '1d');
    const refreshToken = this.tokenService.createAuthToken(
      user.id,
      false,
      '1y',
    );

    this.eventEmitter.emit(EVENT_USER_CREATED, {
      user,
    });

    await this.refreshTokenEntity.create(refreshToken);

    return {
      id: user.id,
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async deleteUser(user: string) {
    await this.user.delete(user);
  }

  async getFollowers(user: string, page: number): Promise<IUser[]> {
    const followers = await this.followEntity.getFollowers(user);

    return followers.map((f) => f.follower);
  }

  async getFollowing(user: string, page: number): Promise<IUser[]> {
    const records = await this.followEntity.getFollowed(user);

    if (records.length === 0) {
      return [];
    }

    const following = records.map((f) => f.followed);

    //Collect ids and check online status
    const ids = following.map((user) => user.id);
    const statuses = this.userOnlineStatusService.getUserStatusMany(ids);

    following.forEach((user) => {
      user.online = !!statuses[user.id];
    });

    return following;
  }

  async getBlockedUsers(user: string, page: number): Promise<IUser[]> {
    const blocked = await this.blockEntity.getBlockedUsers(user);

    return blocked.map((record) => record.blocked);
  }
}
