import { IFollow } from '@backend_2/follow/follow.entity';
import { IStream } from '@warpy/lib';
import { IConnectRecvTransportParams, IParticipant, IUser } from '@warpy/lib';

export const createStreamFixture = (data: Partial<IStream>): IStream => {
  return {
    id: 'test-id',
    owner: 'test owner',
    hub: 'hub',
    preview: 'test-preview',
    title: 'test',
    ...data,
  };
};

export const createUserFixture = (data: Partial<IUser>): IUser => {
  return {
    id: 'test-id',
    last_name: 'test',
    first_name: 'test',
    avatar: 'avatar.com/test',
    email: null,
    sub: null,
    username: 'test_username',
    ...data,
  };
};

export const createParticipantFixture = (
  data: Partial<IParticipant>,
): IParticipant => ({
  ...createUserFixture(data),
  stream: 'test-stream-id',
  role: 'viewer',
  isRaisingHand: false,
  ...data,
});

export const createRecvTransportParamsFixture = (
  data: Partial<IConnectRecvTransportParams>,
): IConnectRecvTransportParams => ({
  roomId: 'test-room-id',
  user: 'test-user-id',
  routerRtpCapabilities: {
    test: true,
  },
  recvTransportOptions: {
    test: true,
  },
  ...data,
});

export const createFollowRecord = (data: Partial<IFollow>): IFollow => ({
  followed_id: 'followed',
  follower_id: 'follower',
  follower: createUserFixture({ id: 'follower' }),
  followed: createUserFixture({ id: 'followed' }),
  ...data,
});
