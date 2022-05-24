import { MessageService } from '@warpy-be/message/message.service';
import { Injectable } from '@nestjs/common';
import { StreamEntity } from '../common/stream.entity';
import { PreviousStreamCacheService } from './previous-stream.cache';

@Injectable()
export class PreviousStreamService {
  constructor(
    private previousStreamCache: PreviousStreamCacheService,
    private messageService: MessageService,
    private streamEntity: StreamEntity,
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
