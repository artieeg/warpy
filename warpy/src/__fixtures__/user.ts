import {User} from '@app/models';
import {Participant} from '@warpy/lib';

export const createUserFixture = (data?: Partial<User>): User => {
  return {
    id: 'test-id',
    username: 'test username',
    avatar: 'vvatar',
    first_name: 'Test',
    last_name: 'Name',
    ...data,
  };
};

export const createParticipantFixture = (
  data?: Partial<Participant>,
): Participant => {
  return {
    ...createUserFixture(data),
    role: 'viewer',
    stream: 'test',
    isRaisingHand: false,
    ...data,
  };
};
