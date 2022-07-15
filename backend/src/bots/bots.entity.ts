import { Injectable } from '@nestjs/common';
import { BotStore } from 'lib/stores/bot';

@Injectable()
export class NjsBotStore extends BotStore {}
