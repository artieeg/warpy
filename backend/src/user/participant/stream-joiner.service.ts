import { Injectable } from '@nestjs/common';
import { StreamJoiner } from 'lib/services';

@Injectable()
export class NjsStreamJoiner extends StreamJoiner {}
