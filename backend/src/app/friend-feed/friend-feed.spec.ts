import { getMockedInstance } from '@warpy-be/utils';
import {
  createParticipantFixture,
  createStreamFixture,
} from '@warpy-be/__fixtures__';
import { FollowStore } from '../follow';
import { ParticipantStore } from '../participant';
import { StreamStore } from '../stream';
import { FriendFeedService } from './friend-feed.service';

describe('FriendFeed', () => {
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const followStore = getMockedInstance<FollowStore>(FollowStore);
  const streamStore = getMockedInstance<StreamStore>(StreamStore);

  const service = new FriendFeedService(
    participantStore as any,
    followStore as any,
    streamStore as any,
  );

  const followedUserIds = ['user1', 'user2', 'user3'];
  const participants = [
    createParticipantFixture({ id: followedUserIds[1], stream: 'stream1' }),
    createParticipantFixture({ id: followedUserIds[2], stream: 'stream2' }),
  ];
  const streams = [
    createStreamFixture({ id: 'stream1' }),
    createStreamFixture({ id: 'stream2' }),
  ];

  followStore.getFollowedUserIds.mockResolvedValue(followedUserIds);
  participantStore.list.mockResolvedValue(participants);
  streamStore.findByIds.mockResolvedValue(streams);

  it('builds friend feed', async () => {
    expect(service.getFriendFeed('user0')).resolves.toStrictEqual([
      { user: participants[0], stream: streams[0] },
      { user: participants[1], stream: streams[1] },
    ]);
  });
});
