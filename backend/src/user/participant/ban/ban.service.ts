import { Injectable } from '@nestjs/common';
import { StreamBanService } from 'lib/services';

@Injectable()
export class NjsStreamBanService extends StreamBanService {}
