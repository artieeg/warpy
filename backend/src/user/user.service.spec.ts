import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  createStreamFixture,
  createUserFixture,
} from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { mockedUserEntity } from './user.entity.mock';
import { TokenService } from '@warpy-be/token/token.service';
import { mockedTokenService } from '@warpy-be/token/token.service.mock';
import { RefreshTokenEntity } from '@warpy-be/token/refresh-token.entity';
import { mockedRefreshTokenEntity } from '@warpy-be/token/token.entity.mock';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { StreamEntity } from '@warpy-be/stream/stream.entity';
import { mockedStreamEntity } from '@warpy-be/stream/stream.entity.mock';
import { mockedFollowEntity } from '@warpy-be/follow/follow.entity.mock';
import { when } from 'jest-when';
import { FollowEntity } from '@warpy-be/follow/follow.entity';
import { CoinBalanceEntity } from '@warpy-be/coin-balance/coin-balance.entity';
import { mockedCoinBalanceEntity } from '@warpy-be/coin-balance/coin-balance.entity.mock';

describe('UserService', () => {
  let userService: UserService;

  const testUser = createUserFixture({});

  beforeEach(async () => {
    const moduleRef = await testModuleBuilder
      .overrideProvider(UserEntity)
      .useValue(mockedUserEntity)
      .overrideProvider(CoinBalanceEntity)
      .useValue(mockedCoinBalanceEntity)
      .overrideProvider(TokenService)
      .useValue(mockedTokenService)
      .overrideProvider(RefreshTokenEntity)
      .useValue(mockedRefreshTokenEntity)
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)
      .overrideProvider(FollowEntity)
      .useValue(mockedFollowEntity)
      .compile();

    userService = await moduleRef.resolve(UserService);
  });

  describe('getting user info', () => {
    const requesterId = 'test';

    const currentStream = createStreamFixture({});
    const participantCount = 6;
    const isFollowed = false;
    const isFollower = true;

    beforeAll(() => {
      mockedStreamEntity.findById.mockResolvedValue(currentStream);
      mockedUserEntity.findById.mockResolvedValue(testUser);
      mockedParticipantEntity.getCurrentStreamFor.mockResolvedValue(
        currentStream.id,
      );
      mockedParticipantEntity.count.mockResolvedValue(participantCount);
      when(mockedFollowEntity.isFollowing)
        .calledWith(testUser.id, requesterId)
        .mockResolvedValue(isFollower);

      when(mockedFollowEntity.isFollowing)
        .calledWith(requesterId, testUser.id)
        .mockResolvedValue(isFollowed);
    });

    it('tells when we are following the user', () => {
      expect(
        userService.getUserInfo(testUser.id, requesterId),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          isFollowed,
        }),
      );
    });

    it('tells when the user follows us', async () => {
      expect(
        userService.getUserInfo(testUser.id, requesterId),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          isFollower,
        }),
      );
    });

    it('fetches a stream the user is in', async () => {
      expect(
        userService.getUserInfo(testUser.id, requesterId),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          stream: {
            participants: participantCount,
            title: currentStream.title,
            id: currentStream.id,
          },
        }),
      );
    });

    it('fetches the user data', async () => {
      expect(
        userService.getUserInfo(testUser.id, requesterId),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          user: testUser,
        }),
      );
    });
  });

  it('returns user if it exists', () => {
    expect(userService.getById(testUser.id)).resolves.toEqual(
      expect.objectContaining({
        user: testUser,
      }),
    );
  });

  it('getById throws an error if user is null', async () => {
    mockedUserEntity.findById.mockResolvedValueOnce(null);

    expect(userService.getById('test-user')).rejects.toThrow();
  });

  it('creates a new user', async () => {
    const newUser = createUserFixture({});

    mockedUserEntity.createNewUser.mockResolvedValueOnce(newUser);

    const response = await userService.createDevUser({
      username: 'test_username',
      kind: 'dev',
      last_name: 'test',
      first_name: 'test',
      email: 'test@sth.com',
      avatar: 'tenor.com/avatar',
    });

    expect(response).toStrictEqual({
      id: newUser.id,
      access: mockedTokenService.testTokenValue,
      refresh: mockedTokenService.testTokenValue,
    });
  });

  describe('creating user', async () => {
    it.todo('creates coin balance');
    it.todo('creates account via google');
    it.todo('creates account via apple');
    it.todo('creates account via twitter');
  });

  it('searches user', async () => {
    const foundUsers = [createUserFixture({}), createUserFixture({})];
    mockedUserEntity.search.mockResolvedValueOnce(foundUsers);

    expect(userService.search('test')).resolves.toStrictEqual(foundUsers);
  });

  it('deletes user', async () => {
    await userService.deleteUser('test-user');

    expect(mockedUserEntity.delete).toHaveBeenCalledWith('test-user');
  });
});
