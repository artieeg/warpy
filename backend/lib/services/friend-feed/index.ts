import { IFriendFeedItem } from '@warpy/lib';
import { IParticipantStore, IFollowStore, IStreamStore } from 'lib';

export interface IFriendFeedService {
  getFriendFeed(user: string): Promise<IFriendFeedItem[]>;
}

export class FriendFeedService {
  constructor(
    private participant: IParticipantStore,
    private follow: IFollowStore,
    private stream: IStreamStore,
  ) {}

  async getFriendFeed(user: string): Promise<IFriendFeedItem[]> {
    //Get a list of users we're following
    const following = await this.follow.getFollowedUserIds(user);

    //Check who's participating in rooms
    const participants = await this.participant.list(following);

    //Get stream
    const streamIds = [...new Set(participants.map((p) => p.stream))];
    const streams = await this.stream.findByIds(streamIds);

    //Prepare feed
    const feed: IFriendFeedItem[] = participants.map((user) => {
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
