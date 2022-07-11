import { IUser, IUserInfoResponse } from '@warpy/lib';
import { UserStore } from 'lib/stores';
import { FollowStore } from 'lib/stores/follow';
import { ParticipantStore } from 'lib/stores/participant';
import { StreamStore } from 'lib/stores/stream';

export interface UserDataFetcher {
  find: (user: string, details?: boolean) => Promise<IUser>;
  getUserInfo: (id: string, requester: string) => Promise<IUserInfoResponse>;
}

export class UserDataFetcherImpl implements UserDataFetcher {
  constructor(
    private store: UserStore,
    private followStore: FollowStore,
    private participantStore: ParticipantStore,
    private streamStore: StreamStore,
  ) {}

  async getUserInfo(id: string, requester: string) {
    const [user, currentStreamId, isFollowed, isFollower] = await Promise.all([
      this.store.find(id, false),
      this.participantStore.getStreamId(id),
      this.followStore.isFollowing(requester, id),
      this.followStore.isFollowing(id, requester),
    ]);

    const response = {
      user,
      isFollowed,
      isFollower,
    };

    if (currentStreamId) {
      const stream = await this.streamStore.findById(currentStreamId);

      if (stream) {
        response['stream'] = {
          title: stream.title,
          id: stream.id,
          participants: await this.participantStore.count(currentStreamId),
        };
      }
    }

    return response as any;
  }

  async find(user: string, details?: boolean) {
    return this.store.find(user, details);
  }
}
