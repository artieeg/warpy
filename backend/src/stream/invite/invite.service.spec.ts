import { NoPermissionError } from '@warpy-be/errors';
import { mockedEventEmitter } from '@warpy-be/events/events.service.mock';
import { FollowEntity } from '@warpy-be/follow/follow.entity';
import { mockedFollowEntity } from '@warpy-be/follow/follow.entity.mock';
import { MessageService } from '@warpy-be/message/message.service';
import { mockedMessageService } from '@warpy-be/message/message.service.mock';
import { StreamEntity } from '@warpy-be/stream/stream.entity';
import { mockedStreamEntity } from '@warpy-be/stream/stream.entity.mock';
import {
  createFollowRecord,
  createInviteFixture,
  createStreamFixture,
} from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
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
      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)
      .overrideProvider(MessageService)
      .useValue(mockedMessageService)
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

  it('sends a message with invite to a bot', async () => {
    const inviter = 'user1';
    const stream = 'stream0';
    const invitee = 'bot_testbot0';

    mockedStreamEntity.findById.mockResolvedValueOnce(
      createStreamFixture({ id: stream, owner: inviter }),
    );

    await inviteService.createStreamInvite({ inviter, stream, invitee });

    expect(mockedMessageService.sendMessage).toBeCalledWith(invitee, {
      event: 'bot-invite',
      data: {
        stream,
        inviteDetailsToken: expect.anything(),
      },
    });
  });

  it('checks so only stream hosts can invite a bot', () => {
    const anotherUser = 'user0';
    const inviter = 'user1';
    const stream = 'stream0';

    mockedStreamEntity.findById.mockResolvedValueOnce(
      createStreamFixture({ id: stream, owner: anotherUser }),
    );

    expect(
      inviteService.createStreamInvite({
        inviter,
        invitee: 'bot_testbot0',
        stream,
      }),
    ).rejects.toThrowError(NoPermissionError);
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
