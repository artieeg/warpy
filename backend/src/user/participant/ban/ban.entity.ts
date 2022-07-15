import { Injectable } from '@nestjs/common';
import { StreamBanStore } from 'lib/stores/stream-bans';

@Injectable()
export class NjsStreamBanStore extends StreamBanStore {}
