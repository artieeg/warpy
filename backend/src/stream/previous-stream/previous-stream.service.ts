import { NjsMessageService } from '@warpy-be/message/message.service';
import { Injectable } from '@nestjs/common';
import { NjsStreamStore } from '../common/stream.entity';
import { NjsPreviousStreamStore } from './previous-stream.cache';

@Injectable()
export class PreviousStreamService {
  constructor(
    private previousStreamCache: NjsPreviousStreamStore,
    private messageService: NjsMessageService,
    private streamEntity: NjsStreamStore,
  ) {}

  async clearStream(stream: string) {
    await this.previousStreamCache.delStream(stream);
  }

  async set(user: string, stream: string) {
    return this.previousStreamCache.set(user, stream);
  }

  async sendPreviousStream(user: string) {
    const stream_id = await this.previousStreamCache.get(user);

    if (stream_id) {
      const stream = await this.streamEntity.findById(stream_id);

      if (stream) {
        this.messageService.sendMessage(user, {
          event: 'previous-stream',
          data: {
            stream,
          },
        });
      }
    }
  }

  async expire(user: string) {
    return this.previousStreamCache.expire(user);
  }
}
