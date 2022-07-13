import { Injectable } from '@nestjs/common';
import { MediaService } from 'lib/services';

@Injectable()
export class NjsMediaService extends MediaService {}
