import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { createUserFixture } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { mockedUserEntity } from './user.entity.mock';
import { TokenService } from '@backend_2/token/token.service';
import { mockedTokenService } from '@backend_2/token/token.service.mock';
import { RefreshTokenEntity } from '@backend_2/token/refresh-token.entity';
import { mockedRefreshTokenEntity } from '@backend_2/token/token.entity.mock';

describe('UserService', () => {
  let userService: UserService;

  const testUser = createUserFixture({});

  beforeEach(async () => {
    const moduleRef = await testModuleBuilder
      .overrideProvider(UserEntity)
      .useValue(mockedUserEntity)
      .overrideProvider(TokenService)
      .useValue(mockedTokenService)
      .overrideProvider(RefreshTokenEntity)
      .useValue(mockedRefreshTokenEntity)
      .compile();

    userService = await moduleRef.resolve(UserService);
  });

  it('returns user if it exists', () => {
    expect(userService.getById(testUser.id)).resolves.toEqual(testUser);
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
