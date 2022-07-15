import { Injectable } from '@nestjs/common';
import { BroadcastService } from 'lib/services';

@Injectable()
export class NjsBroadcastService extends BroadcastService {}
