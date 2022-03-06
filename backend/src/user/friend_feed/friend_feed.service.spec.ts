import { UserNotFound } from '@backend_2/errors';
import { FollowEntity } from '@backend_2/follow/follow.entity';
import { mockedFollowEntity } from '@backend_2/follow/follow.entity.mock';
import { ParticipantEntity } from '@backend_2/participant/participant.entity';
import { mockedParticipantEntity } from '@backend_2/participant/participant.entity.mock';
import { StreamEntity } from '@backend_2/stream/stream.entity';
import { mockedStreamEntity } from '@backend_2/stream/stream.entity.mock';
import { UserEntity } from '@backend_2/user/user.entity';
import { mockedUserEntity } from '@backend_2/user/user.entity.mock';
import {
  createParticipantFixture,
  createStreamFixture,
  createUserFixture,
} from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { FriendFeedService } from './friend_feed.service';

describe('FriendFeedService', () => {
  let friendFeedService: FriendFeedService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(UserEntity)
      .useValue(mockedUserEntity)

      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)

      .overrideProvider(UserEntity)
      .useValue(mockedUserEntity)

      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)

      .overrideProvider(FollowEntity)
      .useValue(mockedFollowEntity)

      .compile();

    friendFeedService = m.get(FriendFeedService);
  });

  describe('fetching friend feed', () => {
    const stream = createStreamFixture({});
    const following = ['follow0', 'follow1', 'follow2'];
    const participants = following.map((id) =>
      createParticipantFixture({ id, stream: stream.id }),
    );

    beforeAll(() => {
      mockedFollowEntity.getFollowedUserIds.mockResolvedValue(following);
      mockedParticipantEntity.getByIds.mockResolvedValue(participants);
      mockedStreamEntity.getByIds.mockResolvedValue([stream]);
    });

    it('gets feed', () => {
      expect(friendFeedService.getFriendFeed('user0')).resolves.toStrictEqual(
        following.map((id) => ({
          user: participants.find((p) => p.id === id),
          stream,
        })),
      );
    });
  });
});
