import { StreamStore } from '@warpy-be/stream/common/stream.entity';
import { ParticipantStore } from '@warpy-be/user/participant';
import { Injectable } from '@nestjs/common';
import { IFriendFeedItem } from '@warpy/lib';
import { FollowStore } from '@warpy-be/follow/follow.entity';

@Injectable()
export class FriendFeedService {
  constructor(
    private participant: ParticipantStore,
    private follow: FollowStore,
    private stream: StreamStore,
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
