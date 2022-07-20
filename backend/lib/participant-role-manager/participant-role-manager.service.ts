import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoPermissionError } from '@warpy-be/errors';
import {
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_VIEWER_UPGRADED,
  EVENT_ROLE_CHANGE,
} from '@warpy-be/utils';
import { Roles } from '@warpy/lib';
import { IParticipantStore } from 'lib/participant';
import { IMessageService } from 'lib/message';
import { IMediaService } from 'lib/media';
import { IHostService } from 'lib/stream-host';
import { IUserBlockService } from 'lib/user-block';

export interface IParticipantRoleManagerService {
  setRole(params: {
    userToUpdate: string;
    role: Roles;
    mod?: string;
    stream?: string;
  }): Promise<void>;
}

export class ParticipantRoleManagerService
  implements IParticipantRoleManagerService
{
  constructor(
    private participant: IParticipantStore,
    private blockService: IUserBlockService,
    private messageService: IMessageService,
    private media: IMediaService,
    private events: EventEmitter2,
    private hostService: IHostService,
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
      await this.blockService.isBannedBySpeaker(userToUpdate, stream);
    }

    const oldUserData = await this.participant.get(userToUpdate);

    //receive new media token,
    //send transport data (if upgrading from viewer)
    const media = await this.media.updateMediaRole(oldUserData, role);

    let response = {
      role,
      ...media,
    };

    //Update participant record with a new role
    //and a new send node id (if changed)
    const updatedUser = await this.participant.update(userToUpdate, {
      role,

      //new streamers start with their audio and video disabled
      videoEnabled: role === 'streamer' ? false : oldUserData.videoEnabled,
      audioEnabled: role === 'speaker' ? false : oldUserData.audioEnabled,

      /*
      //mark video as disabled if role set to speaker or viewer
      videoEnabled: !(role === 'speaker' || role === 'viewer')
        ? false
        : undefined,

      //mark audio as disabled if role set to viewer
      audioEnabled: !(role === 'viewer'),
      */
    });

    this.messageService.sendMessage(userToUpdate, {
      event: 'role-change',
      data: response,
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
