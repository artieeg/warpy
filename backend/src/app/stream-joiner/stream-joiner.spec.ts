import { EventEmitter2 } from '@nestjs/event-emitter';
import { BannedFromStreamError } from '@warpy-be/errors';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_REJOIN,
  getMockedInstance,
} from '@warpy-be/utils';
import {
  createParticipantFixture,
  createStreamerParamsFixture,
} from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { StreamJoinerService } from '.';
import { MediaService } from '../media';
import { ParticipantService, ParticipantStore } from '../participant';
import { ParticipantKickerService } from '../participant-kicker';
import { HostService } from '../stream-host';
import { TokenService } from '../token';

describe('StreamJoinerService', () => {
  const participantService =
    getMockedInstance<ParticipantService>(ParticipantService);

  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const mediaService = getMockedInstance<MediaService>(MediaService);
  const hostService = getMockedInstance<HostService>(HostService);
  const tokenService = getMockedInstance<TokenService>(TokenService);
  const participantKickerService = getMockedInstance<ParticipantKickerService>(
    ParticipantKickerService,
  );
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);

  const streamerParams = createStreamerParamsFixture();
  mediaService.getStreamerParams.mockResolvedValue(streamerParams as any);

  const peopleOnStream = 10;

  participantService.getParticipantDataOnStream.mockResolvedValue({
    streamers: [createParticipantFixture({ role: 'streamer' })],
    raisedHands: [],
    count: peopleOnStream,
  });

  const service = new StreamJoinerService(
    participantService as any,
    participantStore as any,
    mediaService as any,
    hostService as any,
    tokenService as any,
    participantKickerService as any,
    events as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('joining a user', () => {
    const stream = 'stream-to-join';
    const newParticipant = createParticipantFixture({
      id: 'joining-user0',
      stream,
    });

    const previouslyKickedParticipantId = 'joining-kicked-user0';

    const viewerParams = {
      recvMediaParams: {},
      token: 'media token',
    };

    mediaService.getViewerParams.mockResolvedValue(viewerParams as any);

    when(participantStore.get)
      .calledWith(newParticipant.id)
      .mockResolvedValue(null);

    when(participantKickerService.isUserKicked)
      .calledWith(newParticipant.id, stream)
      .mockResolvedValue(false);

    when(participantKickerService.isUserKicked)
      .calledWith(previouslyKickedParticipantId, stream)
      .mockResolvedValue(true);

    when(participantService.createNewParticipant)
      .calledWith(stream, newParticipant.id)
      .mockResolvedValue(newParticipant);

    it('throws is the user has been previously kicked', async () => {
      expect(
        service.joinUser(previouslyKickedParticipantId, stream),
      ).rejects.toThrowError(BannedFromStreamError);
    });

    describe('joining completely new participant', () => {
      it('creates a participant', async () => {
        await service.joinUser(newParticipant.id, stream);

        expect(participantService.createNewParticipant).toBeCalledWith(
          stream,
          newParticipant.id,
        );
      });

      it('connects a new participant as a viewer', () => {
        expect(
          service.joinUser(newParticipant.id, stream),
        ).resolves.toStrictEqual(
          expect.objectContaining({
            role: 'viewer',
            mediaPermissionsToken: viewerParams.token,
            recvMediaParams: viewerParams.recvMediaParams,
          }),
        );
      });

      it('emits a new participant event', async () => {
        await service.joinUser(newParticipant.id, stream);

        expect(events.emit).toBeCalledWith(EVENT_NEW_PARTICIPANT, {
          participant: newParticipant,
        });
      });
    });

    describe('rejoining old streamer(streamer)', () => {
      const oldStreamerData = createParticipantFixture({
        stream,
        role: 'streamer',
        id: 'rejoining-streamer0',
      });

      when(participantStore.get)
        .calledWith(oldStreamerData.id)
        .mockResolvedValue(oldStreamerData);

      it('returns send/recv media params', () => {
        expect(
          service.joinUser(oldStreamerData.id, oldStreamerData.stream),
        ).resolves.toStrictEqual(
          expect.objectContaining({
            sendMediaParams: streamerParams.sendMediaParams,
            recvMediaParams: streamerParams.recvMediaParams,
            role: 'streamer',
            //streamers: expect.arrayContaining([oldStreamerData]),
          }),
        );
      });
    });

    describe('rejoining old participant (viewer)', () => {
      const oldParticipantData = createParticipantFixture({
        id: 'rejoining-user0',
        stream,
      });

      when(participantStore.get)
        .calledWith(oldParticipantData.id)
        .mockResolvedValue(oldParticipantData);

      it('emits a participant rejoin event', async () => {
        await service.joinUser(oldParticipantData.id, stream);

        expect(events.emit).toBeCalledWith(EVENT_PARTICIPANT_REJOIN, {
          participant: oldParticipantData,
        });
      });

      it('reactivates old participant', async () => {
        await service.joinUser(oldParticipantData.id, stream);

        expect(participantService.reactivateOldParticipant).toBeCalledWith(
          oldParticipantData,
        );
      });
    });
  });

  describe('joining a bot', () => {
    const stream = 'stream';
    const token = 'token';
    const bot = 'bot0';

    const botParticipant = createParticipantFixture();

    tokenService.decodeToken.mockReturnValue({ stream });
    participantService.createBotParticipant.mockResolvedValue(botParticipant);

    it('creates a bot participant record', async () => {
      await service.joinBot(bot, token);

      expect(participantService.createBotParticipant).toBeCalledWith(
        bot,
        stream,
      );
    });

    it('allows the bot to stream video and audio', async () => {
      await service.joinBot(bot, token);

      expect(mediaService.getStreamerParams).toBeCalledWith({
        user: botParticipant.id,
        roomId: stream,
        audio: true,
        video: true,
      });
    });

    it('returns media params to start streaming', () => {
      expect(service.joinBot(bot, token)).resolves.toStrictEqual({
        mediaPermissionToken: streamerParams.token,
        sendMediaParams: streamerParams.sendMediaParams,
        recvMediaParams: streamerParams.recvMediaParams,
      });
    });
  });
});
