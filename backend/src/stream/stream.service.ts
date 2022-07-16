import { Injectable } from '@nestjs/common';
import { StreamService } from 'lib';

@Injectable()
export class NjsStreamService extends StreamService {}
