import {User, Participant} from '@app/models';

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
    ...createUserFixture(),
    role: 'viewer',
    isRaisingHand: false,
    ...data,
  };
};
