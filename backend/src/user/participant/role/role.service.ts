import { Injectable } from '@nestjs/common';
import { ParticipantRoleManagerService } from 'lib/services/participant-role-manager';

@Injectable()
export class NjsParticipantRoleService extends ParticipantRoleManagerService {}
