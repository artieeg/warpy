import { Injectable } from '@nestjs/common';
import { MessageService } from 'lib/services';

@Injectable()
export class NjsMessageService extends MessageService {}
