import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserNotFound } from '@warpy-be/errors';
import {
  EVENT_USER_CREATED,
  EVENT_USER_DELETED,
  getMockedInstance,
} from '@warpy-be/utils';
import { createUserFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { User } from '@warpy/lib';
import { RefreshTokenStore, TokenService } from '../token';
import { UserService } from './user.service';
import { UserStore } from './user.store';

describe('UserService', () => {
  const userStore = getMockedInstance<UserStore>(UserStore);
  const tokenService = getMockedInstance<TokenService>(TokenService);
  const refreshTokenStore =
    getMockedInstance<RefreshTokenStore>(RefreshTokenStore);
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);

  const service = new UserService(
    userStore as any,
    tokenService as any,
    refreshTokenStore as any,
    events as any,
  );

  describe('creating users', () => {
    const newUser = createUserFixture();
    const createUserParams = {
      username: newUser.username,
      last_name: newUser.last_name,
      first_name: newUser.first_name,
      email: newUser.email,
      avatar: newUser.avatar,
      kind: 'dev' as any,
    };

    const refresh = 'refresh-token-0';
    const access = 'access-token-0';

    userStore.createUser.mockResolvedValue(newUser);

    when(tokenService.createAuthToken)
      .calledWith(newUser.id, expect.anything(), '1y')
      .mockReturnValue(refresh);

    when(tokenService.createAuthToken)
      .calledWith(newUser.id, expect.anything(), '1d')
      .mockReturnValue(access);

    it('emits new user event', async () => {
      await service.createUser(createUserParams);

      expect(events.emit).toBeCalledWith(EVENT_USER_CREATED, {
        user: newUser,
      });
    });

    it('saves new user record', async () => {
      await service.createUser(createUserParams);

      expect(userStore.createUser).toBeCalled();
    });

    it('saves refresh token', async () => {
      await service.createUser(createUserParams);

      expect(refreshTokenStore.create).toBeCalledWith(refresh);
    });

    it('returns refresh and access tokens', () => {
      expect(service.createUser(createUserParams)).resolves.toStrictEqual({
        id: newUser.id,
        refresh,
        access,
      });
    });
  });

  describe('creating anon users', () => {
    const token = 'anon-user-token';
    const anonUserId = 'anon-user0';
    userStore.createAnonUser.mockResolvedValue(anonUserId);
    when(tokenService.createAuthToken)
      .calledWith(anonUserId, expect.anything(), expect.anything())
      .mockReturnValue(token);

    it('creates anon user', () => {
      expect(service.createAnonUser()).resolves.toStrictEqual({
        id: anonUserId,
        access: token,
      });
    });
  });

  describe('searching users by username', () => {
    const requester = 'r_userid0';

    const result = [
      createUserFixture({ id: requester, username: 'qq' }),
      createUserFixture({ username: 'qqa' }),
      createUserFixture({ username: 'qqs' }),
    ];

    userStore.search.mockResolvedValue(result);

    it('filters the requester from the results', () => {
      expect(service.search('qq', requester)).resolves.toStrictEqual([
        result[1],
        result[2],
      ]);
    });
  });

  it('update user', async () => {
    const user = 'user0';
    const update: Partial<User> = { username: 'updated-username' };

    await service.update(user, update);

    expect(userStore.update).toBeCalledWith(user, update);
  });

  describe('search by id', () => {
    const nonExistingUserId = 'non-existing-user-0';
    const existingUser = createUserFixture({
      id: 'existing-user-0',
    });

    const includeDetails = false;

    when(userStore.find)
      .calledWith(nonExistingUserId, includeDetails)
      .mockResolvedValue(null);
    when(userStore.find)
      .calledWith(existingUser.id, includeDetails)
      .mockResolvedValue(existingUser);

    it('throws if not found', () => {
      expect(
        service.findById(nonExistingUserId, includeDetails),
      ).rejects.toThrowError(UserNotFound);
    });

    it('returns user data if found', () => {
      expect(
        service.findById(existingUser.id, includeDetails),
      ).resolves.toStrictEqual(existingUser);
    });
  });

  describe('deleting users', () => {
    const user = 'user-to-delete';

    it('emits user delete event', async () => {
      await service.del(user);

      expect(events.emit).toBeCalledWith(EVENT_USER_DELETED, {
        user,
      });
    });

    it('deletes user record', async () => {
      await service.del(user);

      expect(userStore.del).toBeCalledWith(user);
    });
  });
});
