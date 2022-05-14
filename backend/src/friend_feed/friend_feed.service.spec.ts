import { UserNotFound } from '@warpy-be/errors';
import { FollowEntity } from '@warpy-be/follow/follow.entity';
import { mockedFollowEntity } from '@warpy-be/follow/follow.entity.mock';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { StreamEntity } from '@warpy-be/stream/stream.entity';
import { mockedStreamEntity } from '@warpy-be/stream/stream.entity.mock';
import { UserEntity } from '@warpy-be/user/user.entity';
import { mockedUserEntity } from '@warpy-be/user/user.entity.mock';
import {
  createParticipantFixture,
  createStreamFixture,
  createUserFixture,
} from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
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
