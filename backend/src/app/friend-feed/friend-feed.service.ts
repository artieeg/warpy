import { FriendFeedItem } from '@warpy/lib';
import { ParticipantStore, FollowStore, StreamStore } from '@warpy-be/app';

export class FriendFeedService {
  constructor(
    private participant: ParticipantStore,
    private follow: FollowStore,
    private stream: StreamStore,
  ) {}

  async getFriendFeed(user: string): Promise<FriendFeedItem[]> {
    //Get a list of users we're following
    const following = await this.follow.getFollowedUserIds(user);

    //Check who's participating in rooms
    const participants = await this.participant.list(following);

    //Get stream
    const streamIds = [...new Set(participants.map((p) => p.stream))];
    const streams = await this.stream.findByIds(streamIds);

    //Prepare feed
    const feed: FriendFeedItem[] = participants.map((user) => {
      const stream = streams.find((s) => s.id === user.stream);

      if (stream) {
        user.online = true;
      }

      return {
        user,
        stream,
      };
    });

    return feed;
  }
}
