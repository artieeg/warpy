import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_RAISE_HAND,
  EVENT_STREAMER_MEDIA_TOGGLE,
  getMockedInstance,
} from '@warpy-be/utils';
import {
  createBotInstanceFixture,
  createParticipantFixture,
  createUserFixture,
} from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { Participant } from '@warpy/lib';
import { UserService } from '../user';
import { BotInstanceStore } from './bot-instance.store';
import { ParticipantService } from './participant.service';
import { ParticipantStore } from './participant.store';
import {
  MaxVideoStreamers,
  ParticipantAlreadyLeft,
  UserNotFound,
} from '@warpy-be/errors';
import { BroadcastService } from '../broadcast';

describe('ParticipantService', () => {
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const botInstanceStore =
    getMockedInstance<BotInstanceStore>(BotInstanceStore);
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const userService = getMockedInstance<UserService>(UserService);
  const broadcastService =
    getMockedInstance<BroadcastService>(BroadcastService);

  const service = new ParticipantService(
    participantStore as any,
    botInstanceStore as any,
    events as any,
    userService as any,
    broadcastService as any,
  );

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('toggling audio/video', () => {
    const user = 'toggle_user0';
    const participant = createParticipantFixture({ id: user });

    when(participantStore.getStreamId)
      .calledWith(user)
      .mockResolvedValue(participant.stream);

    participantStore.countVideoStreamers.mockResolvedValue(1);

    it('stores updated flags', async () => {
      await service.setMediaEnabled(user, {
        audioEnabled: true,
        videoEnabled: true,
      });

      expect(participantStore.update).toBeCalledWith(
        user,
        expect.objectContaining({
          audioEnabled: true,
          videoEnabled: true,
        }),
      );
    });

    it('throws when there are more than 4 video streamers', async () => {
      participantStore.countVideoStreamers.mockResolvedValueOnce(4);

      expect(
        service.setMediaEnabled(user, {
          videoEnabled: true,
        }),
      ).rejects.toThrowError(MaxVideoStreamers);
    });

    it('emits media toggle event', async () => {
      await service.setMediaEnabled(user, { videoEnabled: true });

      expect(events.emit).toBeCalledWith(EVENT_STREAMER_MEDIA_TOGGLE, {
        user,
        stream: participant.stream,
        videoEnabled: true,
      });
    });
  });

  describe('removing user/s from stream', () => {
    const user = 'user_to_remove0';
    const stream = 'stream0';

    const botId = 'bot_bot_to_remove';
    const botInstanceId = 'bot_instance_to_remove';
    const botInstance = createBotInstanceFixture({ id: botInstanceId });

    when(botInstanceStore.getBotInstance)
      .calledWith(botId, stream)
      .mockResolvedValue(botInstance);

    it('removes all data from stream', async () => {
      const stream = 'stream0';

      await service.removeAllParticipantsFrom(stream);

      expect(participantStore.removeParticipantDataFromStream).toBeCalledWith(
        stream,
      );
    });

    it('removes a user', async () => {
      await service.removeUserFromStream(user, stream);

      expect(participantStore.del).toBeCalledWith(user);
    });

    it('removes bots', async () => {
      await service.removeUserFromStream(botId, stream);

      expect(participantStore.del).toBeCalledWith(botInstance.id);
    });
  });

  describe('leaving streams', () => {
    const id = 'leaving_user0';
    const nonExistingId = 'leaving_user1';
    const alreadyDeactivatedUserId = 'leaving_user2';

    const botId = 'bot_bot0';
    const botInstanceId = 'bot_instance_1';

    const stream = 'stream0';

    const idsOnStream = ['user0', 'user1', 'user2'];

    const participant = createParticipantFixture({ id, stream });
    const alreadyDeactivatedParticipant = createParticipantFixture({
      id: alreadyDeactivatedUserId,
      stream,
    });
    const botInstance = createBotInstanceFixture({ id: botInstanceId });
    const botParticipant = createParticipantFixture({
      ...botInstance,
      id: botId,
      stream,
    });

    when(participantStore.getParticipantIds)
      .calledWith(stream)
      .mockResolvedValue(idsOnStream);

    when(participantStore.isDeactivated)
      .calledWith(alreadyDeactivatedUserId, stream)
      .mockResolvedValue(true);

    when(participantStore.isDeactivated)
      .calledWith(id, stream)
      .mockResolvedValue(false);

    when(participantStore.get)
      .calledWith(nonExistingId)
      .mockResolvedValue(null);

    when(participantStore.get)
      .calledWith(alreadyDeactivatedUserId)
      .mockResolvedValue(alreadyDeactivatedParticipant);

    when(participantStore.get)
      .calledWith(botId)
      .mockResolvedValue(botParticipant);

    when(botInstanceStore.getBotInstance)
      .calledWith(botId, stream)
      .mockResolvedValue(botInstance);

    when(participantStore.get).calledWith(id).mockResolvedValue(participant);

    it('throws when user not found', () => {
      expect(
        service.handleLeavingParticipant(nonExistingId),
      ).rejects.toThrowError(UserNotFound);
    });

    it('throws when user has already left', () => {
      expect(
        service.handleLeavingParticipant(alreadyDeactivatedUserId),
      ).rejects.toThrowError(ParticipantAlreadyLeft);
    });

    it('broadcasts the leaving user to other users on stream', async () => {
      await service.handleLeavingParticipant(id);

      expect(broadcastService.broadcast).toBeCalledWith(idsOnStream, {
        event: 'user-left',
        data: {
          user: id,
          stream,
        },
      });
    });

    it('emits event', async () => {
      await service.handleLeavingParticipant(id);

      expect(events.emit).toBeCalledWith(EVENT_PARTICIPANT_LEAVE, {
        user: id,
        stream,
      });
    });

    it('if user, deactivates participant', async () => {
      await service.handleLeavingParticipant(id);

      expect(participantStore.setDeactivated).toBeCalledWith(id, stream, true);
    });

    it("if bot, completely removes participant's data", async () => {
      await service.handleLeavingParticipant(botId);

      expect(participantStore.del).toBeCalledWith(botInstanceId);
    });
  });

  describe('request streaming permissions (raise hand)', () => {
    const id = 'user0';

    const participantWithRaisedHand = createParticipantFixture({
      id,
      isRaisingHand: true,
    });

    when(participantStore.update)
      .calledWith(id, { isRaisingHand: true })
      .mockResolvedValue(participantWithRaisedHand);

    it('sets isRaisingHand flag', async () => {
      await service.setRaiseHand(id, true);

      expect(participantStore.update).toBeCalledWith(id, {
        isRaisingHand: true,
      });
    });

    it('emits raise hand event', async () => {
      await service.setRaiseHand(id, true);

      expect(events.emit).toBeCalledWith(
        EVENT_RAISE_HAND,
        participantWithRaisedHand,
      );
    });
  });

  describe('fetching participant data on stream', () => {
    const streamers = [
      createParticipantFixture({ role: 'streamer' }),
      createParticipantFixture({ role: 'streamer' }),
    ];

    const raisedHands = [createParticipantFixture({ isRaisingHand: true })];

    const count = 10;

    participantStore.getStreamers.mockResolvedValue(streamers);
    participantStore.getRaisedHands.mockResolvedValue(raisedHands);
    participantStore.count.mockResolvedValue(count);

    it('returns participant data on the stream', () => {
      expect(
        service.getParticipantDataOnStream('stream0'),
      ).resolves.toStrictEqual({
        streamers,
        raisedHands,
        count,
      });
    });
  });

  describe('fetching stream viewers', () => {
    const viewers = [
      createParticipantFixture(),
      createParticipantFixture(),
      createParticipantFixture(),
    ];
    participantStore.getViewersPage.mockResolvedValue(viewers);

    it('fetches viewers', async () => {
      expect(service.getViewers('stream0', 0)).resolves.toStrictEqual(viewers);
    });
  });

  describe('reactivating participant', () => {
    const participant = createParticipantFixture();

    it('reactivates a rejoining participant', async () => {
      await service.reactivateOldParticipant(participant);

      const { id, stream } = participant;

      expect(participantStore.setDeactivated).toBeCalledWith(id, stream, false);
    });
  });

  describe('fetching participant data', () => {
    const participant = createParticipantFixture();

    const existingUserId = 'user0';
    const nonExistingUserId = 'user1';

    when(participantStore.get)
      .calledWith(existingUserId)
      .mockResolvedValue(participant);

    when(participantStore.get)
      .calledWith(nonExistingUserId)
      .mockResolvedValue(null);

    it('returns participant if it exists', () => {
      expect(service.get(existingUserId)).resolves.toStrictEqual(participant);
    });

    it('throws error if not found', () => {
      expect(service.get(nonExistingUserId)).rejects.toThrowError(UserNotFound);
    });
  });

  describe('creating bot participant', () => {
    const botid = 'bot0';
    const stream = 'stream0';

    const botInstance = createBotInstanceFixture();
    const expectedParticipantData = createParticipantFixture({
      ...botInstance,
      stream,
      audioEnabled: false,
      videoEnabled: false,
      role: 'streamer',
      isBanned: false,
      isBot: true,
    });

    when(botInstanceStore.create)
      .calledWith(botid, stream)
      .mockResolvedValue(botInstance);

    it('saves a new bot participant', async () => {
      await service.createBotParticipant(botid, stream);

      expect(participantStore.add).toBeCalledWith(expectedParticipantData);
    });
  });

  describe('creating new participant', () => {
    const stream = 'stream0';
    const userid = 'user0';

    const user = createUserFixture({ id: userid });
    const expectedParticipantData: Participant = {
      ...user,
      role: 'viewer',
      isBanned: false,
      isBot: false,
      stream,
    };

    when(userService.findById).calledWith(userid).mockResolvedValue(user);

    it('returns new participant', async () => {
      expect(
        service.createNewParticipant(stream, userid),
      ).resolves.toStrictEqual(
        expect.objectContaining(expectedParticipantData),
      );
    });

    it('saves new participant', async () => {
      await service.createNewParticipant(stream, userid);

      expect(participantStore.add).toBeCalledWith(expectedParticipantData);
    });
  });
});
