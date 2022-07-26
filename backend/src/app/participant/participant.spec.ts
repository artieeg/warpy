import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_RAISE_HAND,
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

  describe('rejoining participant', () => {
    const rejoiningParticipant = createParticipantFixture();

    it('emits rejoin event', async () => {
      await service.rejoinExistingParticipant(rejoiningParticipant);

      expect(events.emit).toBeCalledWith(EVENT_PARTICIPANT_REJOIN, {
        participant: rejoiningParticipant,
      });
    });

    it('reactivates a rejoining participant', async () => {
      await service.rejoinExistingParticipant(rejoiningParticipant);

      const { id, stream } = rejoiningParticipant;

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
