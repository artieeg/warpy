import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_NEW_PARTICIPANT, getMockedInstance } from '@warpy-be/utils';
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
import { StreamBanStore } from './stream-bans.store';
import { UserNotFound } from '@warpy-be/errors';

describe('ParticipantService', () => {
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const botInstanceStore =
    getMockedInstance<BotInstanceStore>(BotInstanceStore);
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const userService = getMockedInstance<UserService>(UserService);
  const streamBanStore = getMockedInstance<StreamBanStore>(StreamBanStore);

  const service = new ParticipantService(
    participantStore as any,
    botInstanceStore as any,
    events as any,
    userService as any,
    streamBanStore as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
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

    it('emits event', async () => {
      await service.createBotParticipant(botid, stream);

      expect(events.emit).toBeCalledWith(EVENT_NEW_PARTICIPANT, {
        participant: expectedParticipantData,
      });
    });

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

    it('emits event', async () => {
      await service.createNewParticipant(stream, userid);

      expect(events.emit).toBeCalledWith(EVENT_NEW_PARTICIPANT, {
        participant: expectedParticipantData,
      });
    });
  });
});
