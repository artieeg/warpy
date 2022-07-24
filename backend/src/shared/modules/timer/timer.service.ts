import { Injectable } from '@nestjs/common';
import { TimerService } from '@warpy-be/app';

@Injectable()
export class NjsTimerService extends TimerService {}
