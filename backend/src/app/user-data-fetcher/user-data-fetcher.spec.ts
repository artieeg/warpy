import { getMockedInstance } from '@warpy-be/utils';
import { createStreamFixture, createUserFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { ParticipantStore, StreamStore } from '..';
import { FollowStore } from '../follow';
import { UserService } from '../user/user.service';
import { UserDataFetcherService } from './user-data-fetcher.service';

describe('UserDataFetcherService', () => {
  const userService = getMockedInstance<UserService>(UserService);
  const followStore = getMockedInstance<FollowStore>(FollowStore);
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const streamStore = getMockedInstance<StreamStore>(StreamStore);

  const service = new UserDataFetcherService(
    userService as any,
    followStore as any,
    participantStore as any,
    streamStore as any,
  );

  const requester = 'requester-user0';

  const stream = createStreamFixture({ id: 'stream0' });
  const userOnStream = createUserFixture({
    id: 'user0',
  });

  const userNotOnStream = createUserFixture({ id: 'user1' });

  followStore.isFollowing.mockResolvedValue(false);
  when(userService.findById)
    .calledWith(userOnStream.id, false)
    .mockResolvedValue(userOnStream);
  when(userService.findById)
    .calledWith(userNotOnStream.id, false)
    .mockResolvedValue(userNotOnStream);

  when(participantStore.getStreamId)
    .calledWith(userOnStream.id)
    .mockResolvedValue(stream.id);
  when(streamStore.findById).calledWith(stream.id).mockResolvedValue(stream);

  when(participantStore.getStreamId)
    .calledWith(userNotOnStream.id)
    .mockResolvedValue(null);

  when(participantStore.count).mockResolvedValue(10);

  it('fetches stream info if the requested user is on stream', () => {
    expect(
      service.getUserInfo(userOnStream.id, requester),
    ).resolves.toStrictEqual({
      user: userOnStream,
      isFollower: false,
      isFollowed: false,
      stream: {
        id: stream.id,
        title: stream.title,
        participants: 10,
      },
    });
  });

  it('returns user info', () => {
    expect(
      service.getUserInfo(userNotOnStream.id, requester),
    ).resolves.toStrictEqual({
      user: userNotOnStream,
      isFollower: false,
      isFollowed: false,
      stream: undefined,
    });
  });
});
