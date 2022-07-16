import { Controller, Injectable, Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { OnHostReassign } from '@warpy-be/interfaces';
import { EVENT_HOST_REASSIGN } from '@warpy-be/utils';
import { ParticipantRoleManagerService } from 'lib';
import { HostModule, MediaModule, UserBlockModule } from '.';
import { ISetRoleRequest } from '@warpy/lib';

@Injectable()
export class NjsParticipantRoleService extends ParticipantRoleManagerService {}

@Controller()
export class ParticipantRoleController implements OnHostReassign {
  constructor(private role: NjsParticipantRoleService) {}

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

@Module({
  imports: [UserBlockModule, HostModule, MediaModule],
  providers: [NjsParticipantRoleService],
  controllers: [ParticipantRoleController],
  exports: [NjsParticipantRoleService],
})
export class ParticipantRoleModule {}
