import { Injectable } from '@nestjs/common';
import { TimerService } from 'lib';

@Injectable()
export class NjsTimerService extends TimerService {}
