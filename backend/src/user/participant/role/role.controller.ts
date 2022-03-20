import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { OnHostReassign } from '@warpy-be/interfaces';
import { EVENT_HOST_REASSIGN } from '@warpy-be/utils';
import { ISetRoleRequest } from '@warpy/lib';
import { ParticipantRoleService } from './role.service';

@Controller()
export class ParticipantRoleController implements OnHostReassign {
  constructor(private role: ParticipantRoleService) {}

  @OnEvent(EVENT_HOST_REASSIGN)
  async onHostReassign({ stream, host }) {
    return this.role.setRole({
      userToUpdate: host.id,
      role: 'streamer',
      stream: host.stream,
    });
  }

  @MessagePattern('participant.set-role')
  async onSetRole({ user, userToUpdate, role }: ISetRoleRequest) {
    await this.role.setRole({
      userToUpdate,
      role,
      mod: user,
    });
  }
}
