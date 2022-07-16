import { Injectable } from '@nestjs/common';
import { ActiveSpeakerService } from 'lib';

@Injectable()
export class NjsActiveSpeakerService extends ActiveSpeakerService {}
