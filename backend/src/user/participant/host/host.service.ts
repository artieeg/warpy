import { Injectable } from '@nestjs/common';
import { HostService } from 'lib/services/stream-host';

@Injectable()
export class NjsHostService extends HostService {}
