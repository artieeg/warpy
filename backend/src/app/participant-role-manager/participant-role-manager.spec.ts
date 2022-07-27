import { EventEmitter2 } from '@nestjs/event-emitter';
import { BlockedByAnotherSpeaker, NoPermissionError } from '@warpy-be/errors';
import {
  EVENT_ROLE_CHANGE,
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_VIEWER_UPGRADED,
  getMockedInstance,
} from '@warpy-be/utils';
import { createParticipantFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { ParticipantRoleManagerService } from '.';
import {
  HostService,
  MediaService,
  MessageService,
  ParticipantStore,
  UserBlockService,
} from '..';

describe('ParticipantRoleManagerService', () => {
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const userBlockService =
    getMockedInstance<UserBlockService>(UserBlockService);
  const messageService = getMockedInstance<MessageService>(MessageService);
  const mediaService = getMockedInstance<MediaService>(MediaService);
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const hostService = getMockedInstance<HostService>(HostService);

  const service = new ParticipantRoleManagerService(
    participantStore as any,
    userBlockService as any,
    messageService as any,
    mediaService as any,
    events as any,
    hostService as any,
  );

  const existingHostId = 'role-hostid0';
  const nonExistingHostId = 'role-hostid1';
  const host = createParticipantFixture({
    id: existingHostId,
    role: 'streamer',
  });

  const userToUpdate = createParticipantFixture();

  when(participantStore.get)
    .calledWith(userToUpdate.id)
    .mockResolvedValue(userToUpdate);

  when(hostService.getHostInfo)
    .calledWith(existingHostId)
    .mockResolvedValue(host);

  when(hostService.getHostInfo)
    .calledWith(nonExistingHostId)
    .mockResolvedValue(null);

  const userBlockedByOtherStreamers = createParticipantFixture({
    id: 'role-blockeduser0',
  });

  const updatedUser = createParticipantFixture();
  participantStore.update.mockResolvedValue(updatedUser);

  when(userBlockService.isBlockedByStreamer)
    .calledWith(
      userBlockedByOtherStreamers.id,
      userBlockedByOtherStreamers.stream,
    )
    .mockRejectedValue(new BlockedByAnotherSpeaker());

  it('throws if mod is not a host', async () => {
    expect(
      service.setRole({
        userToUpdate: 'user',
        role: 'streamer',
        mod: nonExistingHostId,
      }),
    ).rejects.toThrowError(NoPermissionError);
  });

  it('if becoming audio/video streamer, check if the user has been banned by other steamers', async () => {
    expect(
      service.setRole({
        userToUpdate: userBlockedByOtherStreamers.id,
        role: 'streamer',
        mod: existingHostId,
      }),
    ).rejects.toThrowError(BlockedByAnotherSpeaker);
  });

  it('new speakers start with audio disabled', async () => {
    await service.setRole({
      userToUpdate: userToUpdate.id,
      role: 'speaker',
      mod: existingHostId,
    });

    expect(participantStore.update).toBeCalledWith(userToUpdate.id, {
      role: 'speaker',
      audioEnabled: false,
      videoEnabled: userToUpdate.videoEnabled,
    });
  });

  it('new video streamers start with video disabled', async () => {
    await service.setRole({
      userToUpdate: userToUpdate.id,
      role: 'streamer',
      mod: existingHostId,
    });

    expect(participantStore.update).toBeCalledWith(userToUpdate.id, {
      role: 'streamer',
      audioEnabled: userToUpdate.audioEnabled,
      videoEnabled: false,
    });
  });

  it('sends a message about role change to the user', async () => {
    await service.setRole({
      userToUpdate: userToUpdate.id,
      role: 'streamer',
      mod: existingHostId,
    });

    expect(messageService.sendMessage).toBeCalledWith(userToUpdate.id, {
      event: 'role-change',
      data: expect.objectContaining({
        role: 'streamer',
      }),
    });
  });

  it('emits role change event', async () => {
    await service.setRole({
      userToUpdate: userToUpdate.id,
      role: 'streamer',
      mod: existingHostId,
    });

    expect(events.emit).toBeCalledWith(EVENT_ROLE_CHANGE, {
      participant: updatedUser,
    });
  });

  it('emits streamer downgrade event', async () => {
    await service.setRole({
      userToUpdate: userToUpdate.id,
      role: 'viewer',
      mod: existingHostId,
    });

    expect(events.emit).toBeCalledWith(EVENT_STREAMER_DOWNGRADED_TO_VIEWER, {
      participant: updatedUser,
    });
  });

  it('emits viewer upgrade event', async () => {
    await service.setRole({
      userToUpdate: userToUpdate.id,
      role: 'speaker',
      mod: existingHostId,
    });

    expect(events.emit).toBeCalledWith(EVENT_VIEWER_UPGRADED, {
      participant: updatedUser,
    });
  });
});
