import { ParticipantStore, StreamStore } from 'lib';
import { IUserInfoResponse } from '@warpy/lib';
import { UserStore } from 'lib/user';
import { FollowStore } from 'lib/follow';

export class UserDataFetcherService {
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

    const response: IUserInfoResponse = {
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
}
