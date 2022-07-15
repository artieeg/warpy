import { Injectable } from '@nestjs/common';
import { StreamStore } from 'lib/stores/stream';

@Injectable()
export class NjsStreamStore extends StreamStore {}
