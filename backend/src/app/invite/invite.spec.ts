import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_INVITE_AVAILABLE, getMockedInstance } from '@warpy-be/utils';
import {
  createInviteFixture,
  createStreamFixture,
  createUserFixture,
} from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { BotStore } from '../bot';
import { FollowStore } from '../follow';
import { MessageService } from '../message';
import { StreamStore } from '../stream';
import { TokenService } from '../token';
import { UserStore } from '../user';
import { InviteService } from './invite.service';
import { InviteStore } from './invite.store';

describe('InviteService', () => {
  const inviteStore = getMockedInstance<InviteStore>(InviteStore);
  const userStore = getMockedInstance<UserStore>(UserStore);
  const followStore = getMockedInstance<FollowStore>(FollowStore);
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const streamStore = getMockedInstance<StreamStore>(StreamStore);
  const messageService = getMockedInstance<MessageService>(MessageService);
  const tokenService = getMockedInstance<TokenService>(TokenService);
  const botStore = getMockedInstance<BotStore>(BotStore);

  const service = new InviteService(
    inviteStore as any,
    userStore as any,
    followStore as any,
    events as any,
    streamStore as any,
    messageService as any,
    tokenService as any,
    botStore as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('inviting users', () => {
    const inviter = createUserFixture({ id: 'inviter' });
    const invitee = createUserFixture({ id: 'invitee' });
    const stream = createStreamFixture({});
    const invite = createInviteFixture();

    const isInviteeOnline = true;

    inviteStore.create.mockResolvedValue(invite);
    when(userStore.find).calledWith(inviter.id).mockResolvedValue(inviter);
    when(userStore.find).calledWith(invitee.id).mockResolvedValue(invitee);
    when(streamStore.findById).calledWith(stream.id).mockResolvedValue(stream);
    when(inviteStore.isUserOnline)
      .calledWith(invitee.id)
      .mockResolvedValue(isInviteeOnline);

    it('sends new invite to user', async () => {
      await service.createStreamInvite({
        inviter: inviter.id,
        invitee: invitee.id,
        stream: stream.id,
      });

      expect(messageService.sendMessage).toBeCalledWith(
        invitee.id,
        expect.anything(),
      );
    });

    it('emits invite event', async () => {
      await service.createStreamInvite({
        inviter: inviter.id,
        invitee: invitee.id,
        stream: stream.id,
      });

      expect(events.emit).toBeCalledWith(
        EVENT_INVITE_AVAILABLE,
        expect.anything(),
      );
    });

    it('saves invite record', async () => {
      await service.createStreamInvite({
        inviter: inviter.id,
        invitee: invitee.id,
        stream: stream.id,
      });

      expect(inviteStore.create).toBeCalledWith({
        invitee,
        inviter,
        stream,
        received: isInviteeOnline,
      });
    });
    it('saves invite record', async () => {
      await service.createStreamInvite({
        inviter: inviter.id,
        invitee: invitee.id,
        stream: stream.id,
      });

      expect(inviteStore.create).toBeCalledWith({
        invitee,
        inviter,
        stream,
        received: isInviteeOnline,
      });
    });
  });

  describe('deleting invites', () => {
    const idsToDelete = ['invite0', 'invite1'];

    const user = 'user0';

    when(inviteStore.getUserInviteIds)
      .calledWith(user)
      .mockResolvedValue(idsToDelete);

    it("deletes user's invites", async () => {
      await service.deleteUserInvites(user);

      idsToDelete.forEach((id) => expect(inviteStore.del).toBeCalledWith(id));
    });
  });

  describe('checking for new invites', () => {
    const invites = [
      createInviteFixture({ stream_id: '1' }),
      createInviteFixture({ stream_id: '2' }),
      createInviteFixture({ stream_id: undefined, stream: undefined }),
    ];

    inviteStore.getPendingInvitesFor.mockResolvedValue(invites as any);

    it('emits new invites as notifications', async () => {
      await service.checkNewInvitesFor('user');

      expect(events.emit).toBeCalledTimes(2);
      expect(events.emit).toBeCalledWith(EVENT_INVITE_AVAILABLE, invites[0]);
      expect(events.emit).toBeCalledWith(EVENT_INVITE_AVAILABLE, invites[1]);
    });

    it('sends latest invite info', async () => {
      await service.checkNewInvitesFor('user');

      expect(
        messageService.sendMessage(
          'user',
          expect.objectContaining({
            data: {
              invite: invites[invites.length - 1],
            },
          }),
        ),
      );
    });

    it('marks invites as received', async () => {
      await service.checkNewInvitesFor('user');

      expect(inviteStore.updateMany).toBeCalledWith(
        invites.map((i) => i.id),
        { received: true },
      );
    });
  });

  describe('declining invites', () => {
    const declinedInvite = createInviteFixture({});

    when(inviteStore.del)
      .calledWith(declinedInvite.id)
      .mockResolvedValue(declinedInvite);

    it('sends invite state update', async () => {
      await service.declineInvite(declinedInvite.id);

      expect(messageService.sendMessage).toBeCalledWith(
        declinedInvite.inviter_id,
        expect.anything(),
      );
    });

    it('deletes invite data', async () => {
      await service.declineInvite(declinedInvite.id);

      expect(inviteStore.del).toBeCalledWith(declinedInvite.id);
    });
  });

  describe('accepting invites', () => {
    const inviteToStartedStream = createInviteFixture({
      id: 'invite0',
    });

    const invite = createInviteFixture({
      id: 'invite1',
      stream: undefined,
      stream_id: undefined,
    });

    when(inviteStore.get)
      .calledWith(invite.id)
      .mockResolvedValue(invite as any);

    when(inviteStore.get)
      .calledWith(inviteToStartedStream.id)
      .mockResolvedValue(inviteToStartedStream as any);

    it('deletes invite from store if the stream has already started', async () => {
      await service.acceptInvite(inviteToStartedStream.id);

      expect(inviteStore.del).toBeCalledWith(inviteToStartedStream.id);
    });

    it('accepts invite', async () => {
      await service.acceptInvite(invite.id);

      expect(inviteStore.del).not.toBeCalledWith(invite.id);

      expect(messageService.sendMessage).toBeCalledWith(
        invite.inviter_id,
        expect.anything(),
      );
    });
  });
});
