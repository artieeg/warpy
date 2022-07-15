import { Injectable } from '@nestjs/common';
import { BotInstanceService } from 'lib/services';

@Injectable()
export class NjsBotInstanceService extends BotInstanceService {}
