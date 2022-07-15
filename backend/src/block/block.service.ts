import { Injectable } from '@nestjs/common';
import { UserBlockService } from 'lib/services';

@Injectable()
export class NjsBlockService extends UserBlockService {}
