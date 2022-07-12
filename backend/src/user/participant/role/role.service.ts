import { NoPermissionError } from '@warpy-be/errors';
import { NjsMediaService } from '@warpy-be/media/media.service';
import { MessageService } from '@warpy-be/message/message.service';
import {
  EVENT_ROLE_CHANGE,
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_VIEWER_UPGRADED,
} from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Roles } from '@warpy/lib';
import { NjsParticipantStore } from '../store';
import { NjsHostService } from '../host/host.service';
import { BlockService } from '@warpy-be/block/block.service';

@Injectable()
export class ParticipantRoleService {
  constructor(
    private participant: NjsParticipantStore,
    private blockService: BlockService,
    private messageService: MessageService,
    private media: NjsMediaService,
    private eventEmitter: EventEmitter2,
    private hostService: NjsHostService,
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
      this.eventEmitter.emit(EVENT_STREAMER_DOWNGRADED_TO_VIEWER, dataToEmit);
    } else if (oldUserData.role === 'viewer') {
      this.eventEmitter.emit(EVENT_VIEWER_UPGRADED, dataToEmit);
    }

    this.eventEmitter.emit(EVENT_ROLE_CHANGE, dataToEmit);
  }
}
