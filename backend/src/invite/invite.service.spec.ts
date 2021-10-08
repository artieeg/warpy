import { mockedEventEmitter } from '@backend_2/events/events.service.mock';
import { FollowEntity } from '@backend_2/follow/follow.entity';
import { mockedFollowEntity } from '@backend_2/follow/follow.entity.mock';
import {
  createFollowRecord,
  createInviteFixture,
} from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InviteEntity } from './invite.entity';
import { mockedInviteEntity } from './invite.entity.mock';
import { InviteService } from './invite.service';

describe('InviteService', () => {
  let inviteService: InviteService;

  const invite = createInviteFixture({});

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(FollowEntity)
      .useValue(mockedFollowEntity)
      .overrideProvider(EventEmitter2)
      .useValue(mockedEventEmitter)
      .overrideProvider(InviteEntity)
      .useValue(mockedInviteEntity)
      .compile();

    inviteService = m.get(InviteService);

    mockedInviteEntity.create.mockResolvedValue(invite);
  });

  it('sends new invite notification', async () => {
    await inviteService.createStreamInvite({
      inviter: invite.inviter.id,
      stream: invite.stream.id,
      invitee: invite.invitee.id,
    });

    expect(mockedEventEmitter.emit).toBeCalledWith(
      'notification.invite.create',
      invite,
    );
  });

  it('sends an invite delete notification', async () => {
    mockedInviteEntity.delete.mockResolvedValueOnce({
      notification_id: 'test-notification',
      invitee_id: 'test',
    } as any);

    await inviteService.deleteInvite('tes', 'test');

    expect(mockedEventEmitter.emit).toBeCalledWith(
      'notification.cancel',
      'test-notification',
    );
  });

  it('gets invite suggestions', async () => {
    const followers = [createFollowRecord({})];
    const followed = [createFollowRecord({})];

    mockedFollowEntity.getFollowed.mockResolvedValueOnce([
      createFollowRecord({}),
    ]);
    mockedFollowEntity.getFollowers.mockResolvedValueOnce([
      createFollowRecord({}),
    ]);

    expect(inviteService.getInviteSuggestions('test', 'tet2')).resolves.toEqual(
      expect.arrayContaining(
        [...followers, ...followed].map(
          (item) => item.follower || item.followed,
        ),
      ),
    );
  });
});
