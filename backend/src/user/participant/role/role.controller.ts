import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ISetRoleRequest } from '@warpy/lib';
import { ParticipantRoleService } from './role.service';

@Controller()
export class ParticipantRoleController {
  constructor(private role: ParticipantRoleService) {}

  @MessagePattern('participant.set-role')
  async onSetRole({ user, userToUpdate, role }: ISetRoleRequest) {
    await this.role.setRole(user, userToUpdate, role);
  }
}
