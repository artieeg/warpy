import { ParticipantStore } from '@warpy-be/user/participant/store';
import { Injectable } from '@nestjs/common';
import {
  INewUser,
  INewUserResponse,
  IUser,
  IUserInfoResponse,
} from '@warpy/lib';
import { RefreshTokenEntity } from '../token/refresh-token.entity';
import { TokenService } from '../token/token.service';
import { UserStoreService } from './user.store';
import { StreamEntity } from '@warpy-be/stream/common/stream.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FollowEntity } from '@warpy-be/follow/follow.entity';
import { User } from 'lib/services';

@Injectable()
export class UserService {
  private user: User;

  constructor(
    private store: UserStoreService,
    tokenService: TokenService,
    refreshTokenEntity: RefreshTokenEntity,
    events: EventEmitter2,

    private followEntity: FollowEntity,
    private participantEntity: ParticipantStore,
    private streamEntity: StreamEntity,
  ) {
    this.user = new User(store, tokenService, refreshTokenEntity, events);
  }

  async createAnonUser() {
    return this.user.createAnonUser();
  }

  async findById(user: string, details?: boolean) {
    return this.store.find(user, details);
  }

  async getUserInfo(id: string, requester: string): Promise<IUserInfoResponse> {
    const [user, currentStreamId, isFollowed, isFollower] = await Promise.all([
      this.store.find(id, false),
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

  async search(text: string, requester_id: string): Promise<IUser[]> {
    const users = await this.store.search(text);

    return users.filter((user) => user.id !== requester_id);
  }

  async update(user: string, params: Partial<IUser>) {
    await this.store.update(user, params);
  }

  async get(user: string): Promise<IUser> {
    return this.store.find(user);
  }

  async createUser(data: INewUser): Promise<INewUserResponse> {
    return this.user.createUser(data);
  }

  async deleteUser(user: string) {
    await this.store.del(user);
  }
}
