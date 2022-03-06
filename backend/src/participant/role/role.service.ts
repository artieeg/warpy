import { BlockService } from '@backend_2/block/block.service';
import { NoPermissionError } from '@backend_2/errors';
import { MediaService } from '@backend_2/media/media.service';
import { MessageService } from '@backend_2/message/message.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Roles } from '@warpy/lib';
import { ParticipantEntity } from '../common/participant.entity';

@Injectable()
export class ParticipantRoleService {
  constructor(
    private participant: ParticipantEntity,
    private blockService: BlockService,
    private messageService: MessageService,
    private media: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async setRole(mod: string, userToUpdate: string, role: Roles) {
    const moderator = await this.participant.getById(mod);
    const { stream } = moderator;

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    if (role !== 'viewer') {
      await this.blockService.isBannedBySpeaker(userToUpdate, stream);
    }

    const oldUserData = await this.participant.getById(userToUpdate);

    //receive new media token,
    //sendNodeId and send transport data (if upgrading from viewer)
    const { sendNodeId, ...rest } = await this.media.updateRole(
      oldUserData,
      role,
    );

    let response = {
      role,
      rest,
    };

    //Update participant record with a new role
    //and a new send node id (if changed)
    const updatedUser = await this.participant.updateOne(userToUpdate, {
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

    this.eventEmitter.emit('participant.role-change', updatedUser);
  }
}
