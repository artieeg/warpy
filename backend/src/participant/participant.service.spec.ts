import { BlockEntity } from '@backend_2/block/block.entity';
import { mockedBlockEntity } from '@backend_2/block/block.entity.mock';
import {
  BannedFromStreamError,
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@backend_2/errors';
import { mockedEventEmitter } from '@backend_2/events/events.service.mock';
import { mockedMediaService } from '@backend_2/media/media.service.mock';
import { MessageService } from '@backend_2/message/message.service';
import { mockedMessageService } from '@backend_2/message/message.service.mock';
import { StreamBlockEntity } from '@backend_2/stream-block/stream-block.entity';
import { mockedStreamBlockEntity } from '@backend_2/stream-block/stream-block.entity.mock';
import { createParticipantFixture } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { when } from 'jest-when';
import { MediaService } from '../media/media.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './participant.entity';
import { mockedParticipantEntity } from './participant.entity.mock';
import { ParticipantService } from './participant.service';

const mockedStreamBlock = {
  checkUserBanned: jest.fn(),
};

describe('ParticipantService', () => {
  let participantService: ParticipantService;

  const stream = 'test-stream';
  const user = 'test-user';

  const count = 120;
  const speakers = [createParticipantFixture({ role: 'speaker' })];
  const raisedHands = [
    createParticipantFixture({
      role: 'viewer',
      isRaisingHand: true,
    }),
  ];
  const mediaPermissionsToken = 'test';
  const recvMediaParams = { test: true };

  const streamParticipants = ['id1', 'id2'];

  beforeAll(async () => {
    const moduleRef = await testModuleBuilder
      .overrideProvider(StreamBlockEntity)
      .useValue(mockedStreamBlockEntity)
      .overrideProvider(MessageService)
      .useValue(mockedMessageService)
      .overrideProvider(BlockEntity)
      .useValue(mockedBlockEntity)
      .overrideProvider(StreamBlockService)
      .useValue(mockedStreamBlock)
      .overrideProvider(MediaService)
      .useValue(mockedMediaService)
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(EventEmitter2)
      .useValue(mockedEventEmitter)
      .compile();

    participantService = moduleRef.get(ParticipantService);

    mockedParticipantEntity.getWithRaisedHands.mockResolvedValue(raisedHands);
    mockedParticipantEntity.count.mockResolvedValue(count);
    mockedParticipantEntity.getSpeakers.mockResolvedValue(speakers);

    mockedMediaService.getViewerPermissions.mockResolvedValue({
      token: mediaPermissionsToken,
      permissions: {
        recvNodeId: 'test',
      } as any,
    });

    mockedMediaService.getViewerParams.mockResolvedValue(
      recvMediaParams as any,
    );
    mockedParticipantEntity.getIdsByStream.mockResolvedValue(
      streamParticipants,
    );
  });

  it('checks if new viewer is banned', () => {
    mockedStreamBlock.checkUserBanned.mockRejectedValueOnce(
      new BannedFromStreamError(),
    );

    expect(
      participantService.createNewViewer(stream, user),
    ).rejects.toThrowError(BannedFromStreamError);
  });

  it('adds new viewer', () => {
    expect(participantService.createNewViewer(stream, user)).resolves.toEqual({
      speakers,
      raisedHands,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    });
  });

  it('returns stream participants', () => {
    expect(participantService.getStreamParticipants('test')).resolves.toEqual(
      streamParticipants,
    );
  });

  it('emits participant.delete event when a participant has been deleted', async () => {
    const user = 'test';
    const stream = 'test2';

    mockedParticipantEntity.getCurrentStreamFor.mockResolvedValue(stream);

    await participantService.deleteParticipant(user);

    expect(mockedEventEmitter.emit).toBeCalledWith('participant.delete', {
      user,
      stream,
    });
  });

  it('deletes a participant', async () => {
    const stream = 'test2';
    const user = 'user';

    mockedParticipantEntity.getCurrentStreamFor.mockResolvedValue(stream);
    await participantService.deleteParticipant(user);

    expect(mockedParticipantEntity.deleteParticipant).toHaveBeenCalledWith(
      user,
    );
  });

  it('fetches viewers page', async () => {
    const stream = 'stream';
    const page = 4;

    const viewers = [createParticipantFixture({ stream, role: 'viewer' })];

    mockedParticipantEntity.getViewersPage.mockResolvedValue(viewers);

    expect(participantService.getViewers(stream, page)).resolves.toStrictEqual(
      viewers,
    );
  });

  it("updates participant's db record when raising a hard", async () => {
    const user = 'user-test-id';
    const flag = true;

    await participantService.setRaiseHand(user, flag);

    expect(mockedParticipantEntity.setRaiseHand).toBeCalledWith(user, true);
  });

  it('emits a participant.raise-hand event with an updated participant', async () => {
    const user = 'user-test-id';
    const flag = true;

    const updatedParticipant = createParticipantFixture({
      isRaisingHand: true,
    });

    mockedParticipantEntity.setRaiseHand.mockResolvedValueOnce(
      updatedParticipant,
    );

    await participantService.setRaiseHand(user, flag);

    expect(mockedEventEmitter.emit).toBeCalledWith(
      'participant.raise-hand',
      updatedParticipant,
    );
  });

  it('checks permissions when allowing new speaker', async () => {
    const userWithoutPermissions = createParticipantFixture({
      role: 'speaker',
    });
    mockedParticipantEntity.getById.mockResolvedValueOnce(
      userWithoutPermissions,
    );

    expect(
      participantService.allowSpeaker('test-host', 'test-speaker'),
    ).rejects.toThrowError(NoPermissionError);
  });

  it('checks if the new speaking user exists', async () => {
    const user = createParticipantFixture({
      stream: 'test',
      role: 'streamer',
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(user);
    mockedParticipantEntity.makeSpeaker.mockResolvedValueOnce(null);

    expect(
      participantService.allowSpeaker('test-host', 'test-speaker'),
    ).rejects.toThrowError(UserNotFound);
  });

  it('checks if stream exists when allowing new speaker', async () => {
    const user = createParticipantFixture({
      stream: null,
      role: 'streamer',
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(user);

    expect(
      participantService.allowSpeaker('test-host', 'test-speaker'),
    ).rejects.toThrowError(StreamNotFound);
  });

  it('tells the user they are a speaker now', async () => {
    const stream = 'test';

    const user = createParticipantFixture({
      stream,
      role: 'streamer',
    });

    const speaker = createParticipantFixture({
      id: 'new-speaker-id',
      stream,
      role: 'speaker',
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(user);
    mockedParticipantEntity.makeSpeaker.mockResolvedValueOnce(speaker);

    await participantService.allowSpeaker('test-host', speaker.id);

    expect(mockedMessageService.sendMessage).toBeCalledWith(
      speaker.id,
      expect.objectContaining({
        event: 'speaking-allowed',
        data: {
          stream,
          media: expect.anything(),
          mediaPermissionToken: expect.anything(),
        },
      }),
    );
  });

  it('emits new speaker event', async () => {
    const user = createParticipantFixture({
      stream: 'test',
      role: 'streamer',
    });

    const newSpeaker = createParticipantFixture({
      stream,
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(user);
    mockedParticipantEntity.makeSpeaker.mockResolvedValueOnce(newSpeaker);

    await participantService.allowSpeaker('test-host', 'test-speaker');

    expect(mockedEventEmitter.emit).toBeCalledWith(
      'participant.new-speaker',
      newSpeaker,
    );
  });

  it('emits active speakers info', async () => {
    const speakers = [
      createParticipantFixture({ id: 'id-1', stream: 'stream-1' }),
      createParticipantFixture({ id: 'id-3', stream: 'stream-1' }),
      createParticipantFixture({ id: 'id-2', stream: 'stream-2' }),
    ];

    const volumes = {
      [speakers[0].id]: 50,
      [speakers[2].id]: 20,
      [speakers[1].id]: 40,
    };

    mockedParticipantEntity.getByIds.mockResolvedValueOnce(speakers);

    await participantService.broadcastActiveSpeakers(volumes);

    speakers.forEach((speaker) => {
      expect(mockedEventEmitter.emit).toBeCalledWith(
        'participant.active-speakers',
        {
          stream: speaker.stream,
          activeSpeakers: expect.arrayContaining([
            {
              ...speaker,
              volume: volumes[speaker.id],
            },
          ]),
        },
      );
    });
  });

  it('checks kicking permission', async () => {
    const userWithoutPermissions = createParticipantFixture({
      role: 'speaker',
    });
    mockedParticipantEntity.getById.mockResolvedValueOnce(
      userWithoutPermissions,
    );

    expect(
      participantService.kickUser('some-user', userWithoutPermissions.id),
    ).rejects.toThrowError(NoPermissionError);
  });

  it('checks if kicked user exists', async () => {
    const mod = createParticipantFixture({
      role: 'streamer',
    });

    const nonExistentUserId = 'user1';

    when(mockedParticipantEntity.getById)
      .calledWith(nonExistentUserId)
      .mockResolvedValueOnce(null);

    when(mockedParticipantEntity.getById)
      .calledWith(mod.id)
      .mockResolvedValueOnce(mod);

    expect(
      participantService.kickUser('some-user', mod.id),
    ).rejects.toThrowError(UserNotFound);
  });

  it('checks if moderator exists when kicking user', async () => {
    mockedParticipantEntity.getById.mockResolvedValueOnce(null);
    expect(
      participantService.kickUser('test', 'nonexistent-mod'),
    ).rejects.toThrowError(UserNotFound);
  });

  it('checks if moderator and the user to be kicked are in the same stream', async () => {
    const mod = createParticipantFixture({
      id: 'id0',
      role: 'streamer',
      stream: 'stream0',
    });

    const userToKick = createParticipantFixture({
      id: 'id1',
      role: 'viewer',
      stream: 'stream1',
    });

    when(mockedParticipantEntity.getById)
      .calledWith(userToKick.id)
      .mockResolvedValueOnce(userToKick);

    when(mockedParticipantEntity.getById)
      .calledWith(mod.id)
      .mockResolvedValueOnce(mod);

    expect(
      participantService.kickUser(userToKick.id, mod.id),
    ).rejects.toThrowError(NoPermissionError);
  });

  it('removes the kicked user from nodes', async () => {
    const mod = createParticipantFixture({
      id: 'test1',
      role: 'streamer',
    });

    const userToKick = createParticipantFixture({
      id: 'test2',
      role: 'viewer',
    });

    when(mockedParticipantEntity.getById)
      .calledWith(userToKick.id)
      .mockResolvedValueOnce(userToKick);

    when(mockedParticipantEntity.getById)
      .calledWith(mod.id)
      .mockResolvedValueOnce(mod);

    await participantService.kickUser(userToKick.id, mod.id);
    expect(mockedMediaService.removeUserFromNodes).toBeCalledWith(userToKick);
  });

  it('creates a new stream block to prevent the kicked user from joining the stream again', async () => {
    const mod = createParticipantFixture({
      id: 'test',
      role: 'streamer',
    });

    const userToKick = createParticipantFixture({
      id: 'test2',
      role: 'viewer',
    });

    when(mockedParticipantEntity.getById)
      .calledWith(userToKick.id)
      .mockResolvedValueOnce(userToKick);

    when(mockedParticipantEntity.getById)
      .calledWith(mod.id)
      .mockResolvedValueOnce(mod);

    await participantService.kickUser(userToKick.id, mod.id);
    expect(mockedStreamBlockEntity.create).toBeCalledWith(
      userToKick.stream,
      userToKick.id,
    );
  });
});
