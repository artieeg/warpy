import { NoPermissionError } from '@warpy-be/errors';
import { MediaService } from '@warpy-be/media/media.service';
import { MessageService } from '@warpy-be/message/message.service';
import { BlockService } from '@warpy-be/user/block/block.service';
import { EVENT_ROLE_CHANGE } from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Roles } from '@warpy/lib';
import { ParticipantStore } from '../store';

@Injectable()
export class ParticipantRoleService {
  constructor(
    private participant: ParticipantStore,
    private blockService: BlockService,
    private messageService: MessageService,
    private media: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async setRole(mod: string, userToUpdate: string, role: Roles) {
    const moderator = await this.participant.get(mod);
    const { stream } = moderator;

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    if (role !== 'viewer') {
      await this.blockService.isBannedBySpeaker(userToUpdate, stream);
    }

    const oldUserData = await this.participant.get(userToUpdate);

    //receive new media token,
    //sendNodeId and send transport data (if upgrading from viewer)
    const { sendNodeId, ...rest } = await this.media.updateMediaRole(
      oldUserData,
      role,
    );

    let response = {
      role,
      ...rest,
    };

    //Update participant record with a new role
    //and a new send node id (if changed)
    const updatedUser = await this.participant.update(userToUpdate, {
      sendNodeId,
      role,

      //mark video as disabled if role set to speaker or viewer
      videoEnabled: !(role === 'speaker' || role === 'viewer')
        ? false
        : undefined,

      //mark audio as disabled if role set to viewer
      audioEnabled: !(role === 'viewer'),
    });

    this.messageService.sendMessage(userToUpdate, {
      event: 'role-change',
      data: response,
    });

    this.eventEmitter.emit(EVENT_ROLE_CHANGE, updatedUser);
  }
}
