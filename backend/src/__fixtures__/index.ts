import { IFollow } from '@backend_2/follow/follow.entity';
import { IFullParticipant } from '@backend_2/participant/participant.entity';
import {
  IAward,
  IAwardModel,
  IInvite,
  INotification,
  IStream,
} from '@warpy/lib';
import { IConnectRecvTransportParams, IUser } from '@warpy/lib';

export const createStreamFixture = (data: Partial<IStream>): IStream => {
  return {
    id: 'test-id',
    owner: 'test owner',
    category: 'hub',
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
    isAnon: false,
    ...data,
  };
};

export const createParticipantFixture = (
  data: Partial<IFullParticipant>,
): IFullParticipant => ({
  ...createUserFixture(data),
  isBot: false,
  stream: 'test-stream-id',
  role: 'viewer',
  isRaisingHand: false,
  recvNodeId: 'test-node-id',
  sendNodeId: 'test-node-id',
  isBanned: false,
  hasLeftStream: false,
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

export const createInviteFixture = (data: Partial<IInvite>): IInvite => ({
  invitee: createUserFixture({ id: '1' }),
  inviter: createUserFixture({ id: '2' }),
  id: 'test',
  stream: createStreamFixture({}),
  accepted: false,
  declined: false,
  ...data,
});

export const createNotificationFixture = (
  data: Partial<INotification>,
): INotification => ({
  id: 'test',
  hasBeenSeen: false,
  created_at: 1000,
  user_id: 'test2',
  ...data,
});

export const createAwardModelFixture = (
  data: Partial<IAwardModel>,
): IAwardModel => ({
  id: 'test',
  title: 'test award',
  media: 'example.com/media',
  price: 100,
  ...data,
});

export const createAwardFixture = (data: Partial<IAward>): IAward => ({
  id: 'test',
  sender: createUserFixture({ id: 'sender' }),
  recipent: createUserFixture({ id: 'recipent' }),
  award: createAwardModelFixture({ id: 'award' }),
  created_at: new Date().toISOString(),
  message: 'test',
  ...data,
});
