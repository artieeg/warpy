import { Injectable } from '@nestjs/common';
import { TimerService } from 'lib/services';

@Injectable()
export class NjsTimerService extends TimerService {}
