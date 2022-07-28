import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_USER_CREATED, getMockedInstance } from '@warpy-be/utils';
import { createUserFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
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
});
