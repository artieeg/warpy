import { getMockedInstance } from '@warpy-be/utils';
import {
  createParticipantFixture,
  createStreamFixture,
} from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { BroadcastService } from '../broadcast';
import { FollowStore } from '../follow';
import { ParticipantStore } from '../participant';
import { StreamStore } from '../stream';
import { FriendFeedService } from './friend-feed.service';

describe('FriendFeed', () => {
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const followStore = getMockedInstance<FollowStore>(FollowStore);
  const streamStore = getMockedInstance<StreamStore>(StreamStore);
  const broadcastService =
    getMockedInstance<BroadcastService>(BroadcastService);

  const service = new FriendFeedService(
    participantStore as any,
    followStore as any,
    streamStore as any,
    broadcastService as any,
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

  describe('updating friend feed', () => {
    const leavingUserId = 'leaving-user0';

    const joiningUser = createParticipantFixture({ stream: 'joining-stream0' });
    const stream = createStreamFixture({ id: 'joining-stream0' });

    const followerIds = ['user0', 'user1', 'user2'];

    followStore.getFollowerIds.mockResolvedValue(followerIds);

    when(streamStore.findById)
      .calledWith(joiningUser.stream)
      .mockResolvedValue(stream);

    it('when user leaves stream, broadcasts an event to the followers of that user', async () => {
      await service.notifyUserLeave(leavingUserId);

      expect(broadcastService.broadcast).toBeCalledWith(followerIds, {
        event: '@friend-feed/item-delete',
        data: {
          user: leavingUserId,
        },
      });
    });

    it('when user joins stream, broadcasts an event to the followers of that user', async () => {
      await service.notifyUserJoin(joiningUser);

      expect(broadcastService.broadcast).toBeCalledWith(followerIds, {
        event: '@friend-feed/item-add',
        data: {
          user: joiningUser,
          stream,
        },
      });
    });
  });

  it('builds friend feed', async () => {
    expect(service.getFriendFeed('user0')).resolves.toStrictEqual([
      { user: participants[0], stream: streams[0] },
      { user: participants[1], stream: streams[1] },
    ]);
  });
});
