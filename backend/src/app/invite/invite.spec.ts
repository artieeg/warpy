import { EventEmitter2 } from '@nestjs/event-emitter';
import { getMockedInstance } from '@warpy-be/utils';
import { createInviteFixture } from '@warpy-be/__fixtures__';
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
