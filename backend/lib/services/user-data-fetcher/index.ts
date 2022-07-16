import { IUserStore } from 'lib/stores';
import { IFollowStore } from 'lib/stores/follow';
import { IParticipantStore } from 'lib/stores/participant';
import { IStreamStore } from 'lib/stores/stream';

export class UserDataFetcherService {
  constructor(
    private store: IUserStore,
    private followStore: IFollowStore,
    private participantStore: IParticipantStore,
    private streamStore: IStreamStore,
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
}
