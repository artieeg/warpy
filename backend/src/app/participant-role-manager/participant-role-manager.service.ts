import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoPermissionError } from '@warpy-be/errors';
import {
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_VIEWER_UPGRADED,
  EVENT_ROLE_CHANGE,
} from '@warpy-be/utils';
import { Roles } from '@warpy/lib';
import { ParticipantStore } from '@warpy-be/app/participant';
import { MediaService } from '@warpy-be/app/media';
import { HostService } from '@warpy-be/app/stream-host';
import { UserBlockService } from '@warpy-be/app/user-block';
import { MessageService } from '@warpy-be/app';

export class ParticipantRoleManagerService {
  constructor(
    private participant: ParticipantStore,
    private blockService: UserBlockService,
    private messageService: MessageService,
    private media: MediaService,
    private events: EventEmitter2,
    private hostService: HostService,
  ) {}

  async setRole({
    userToUpdate,
    role,
    mod,
    stream: providedStream,
  }: {
    userToUpdate: string;
    role: Roles;
    mod?: string;
    stream?: string;
  }) {
    let stream = providedStream;

    //check permission TODO
    if (mod) {
      const host = await this.hostService.getHostInfo(mod);

      if (!host) {
        throw new NoPermissionError();
      } else {
        stream = host.stream;
      }
    }

    if (role !== 'viewer') {
      await this.blockService.isBlockedByStreamer(userToUpdate, stream);
    }

    const oldUserData = await this.participant.get(userToUpdate);

    //receive new media token
    //and send media params (if upgrading from viewer)
    const media = await this.media.updateMediaRole(oldUserData, role);

    //Update participant record with a new role
    //and a new send node id (if changed)
    const updatedUser = await this.participant.update(userToUpdate, {
      role,

      //new streamers start with their audio and video disabled
      videoEnabled: role === 'streamer' ? false : oldUserData.videoEnabled,
      audioEnabled: role === 'speaker' ? false : oldUserData.audioEnabled,
    });

    this.messageService.sendMessage(userToUpdate, {
      event: 'role-change',
      data: {
        role,
        ...media,
      },
    });

    const dataToEmit = { participant: updatedUser };

    if (role === 'viewer') {
      this.events.emit(EVENT_STREAMER_DOWNGRADED_TO_VIEWER, dataToEmit);
    } else if (oldUserData.role === 'viewer') {
      this.events.emit(EVENT_VIEWER_UPGRADED, dataToEmit);
    }

    this.events.emit(EVENT_ROLE_CHANGE, dataToEmit);
  }
}
