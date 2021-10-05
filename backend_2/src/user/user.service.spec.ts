import { Test } from '@nestjs/testing';
import { UserEntity } from './user.entity';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { createUserFixture } from '@backend_2/__fixtures__';

describe('UserService', () => {
  let userService: UserService;
  let userEntity: UserEntity;

  const testUser = createUserFixture({});

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    userService = await moduleRef.resolve(UserService);
    userEntity = await moduleRef.resolve(UserEntity);

    jest.spyOn(userEntity, 'findById').mockResolvedValue(testUser);
  });

  it('returns user if it exists', () => {
    expect(userService.getById(testUser.id)).resolves.toEqual(testUser);
  });

  it('getById throws an error if user is null', async () => {
    jest.spyOn(userEntity, 'findById').mockResolvedValueOnce(null);

    expect(userService.getById('test-user')).rejects.toThrow();
  });
});
