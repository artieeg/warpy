import { IFollow } from '@warpy-be/app';
import {
  IAward,
  IAwardModel,
  IInvite,
  INotification,
  IParticipant,
  IStream,
} from '@warpy/lib';
import { IConnectRecvTransportParams, IUser } from '@warpy/lib';

function getFixtureCreator<T>(defaults: T) {
  return (data?: Partial<T>): T => {
    return {
      ...defaults,
      ...(data || {}),
    };
  };
}

export const createStreamFixture = getFixtureCreator<IStream>({
  id: 'test-id',
  owner: 'test owner',
  category: 'hub',
  preview: 'test-preview',
  title: 'test',
});

export const createUserFixture = getFixtureCreator<IUser>({
  id: 'test-id',
  last_name: 'test',
  first_name: 'test',
  avatar: 'avatar.com/test',
  email: null,
  sub: null,
  username: 'test_username',
  isAnon: false,
});

export const createParticipantFixture = getFixtureCreator<IParticipant>({
  ...createUserFixture(),
  isBot: false,
  stream: 'test-stream-id',
  role: 'viewer',
  isRaisingHand: false,
  isBanned: false,
});

export const createSendMediaParamsFixture = getFixtureCreator({
  roomId: 'test-room-id',
  user: 'test-user-id',
  routerRtpCapabilities: {
    test: true,
  },
  sendTransportOptions: {
    test: true,
  },
});

export const createRecvMediaParamsFixture = getFixtureCreator({
  roomId: 'test-room-id',
  user: 'test-user-id',
  routerRtpCapabilities: {
    test: true,
  },
  recvTransportOptions: {
    test: true,
  },
});

export const createRecvTransportParamsFixture =
  getFixtureCreator<IConnectRecvTransportParams>({
    roomId: 'test-room-id',
    user: 'test-user-id',
    routerRtpCapabilities: {
      test: true,
    },
    recvTransportOptions: {
      test: true,
    },
  });

export const createFollowRecord = getFixtureCreator<IFollow>({
  followed_id: 'followed',
  follower_id: 'follower',
  follower: createUserFixture({ id: 'follower' }),
  followed: createUserFixture({ id: 'followed' }),
});

export const createInviteFixture = getFixtureCreator<IInvite>({
  invitee_id: '1',
  inviter_id: '2',
  invitee: createUserFixture({ id: '1' }),
  inviter: createUserFixture({ id: '2' }),
  id: 'test',
  stream: createStreamFixture({}),
});

export const createNotificationFixture = getFixtureCreator<INotification>({
  id: 'test',
  hasBeenSeen: false,
  created_at: 1000,
  user_id: 'test2',
});

export const createAwardModelFixture = getFixtureCreator<IAwardModel>({
  id: 'test',
  title: 'test award',
  media: 'example.com/media',
  price: 100,
});

export const createAwardFixture = getFixtureCreator<IAward>({
  id: 'test',
  sender: createUserFixture({ id: 'sender' }),
  recipent: createUserFixture({ id: 'recipent' }),
  visual: 'sth',
  //award: createAwardModelFixture({ id: 'award' }),
  created_at: new Date().toISOString(),
  message: 'test',
});
