import { Injectable } from '@nestjs/common';
import { ParticipantService } from 'lib/services/participant';

@Injectable()
export class NjsParticipantService extends ParticipantService {}
