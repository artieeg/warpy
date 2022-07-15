import { Injectable } from '@nestjs/common';
import { ChatService } from 'lib/services';

@Injectable()
export class NjsChatService extends ChatService {}
