import { Injectable, Controller, Module } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { StreamService, StreamStore } from '@warpy-be/app';
import {
  RequestCreateStream,
  NewStreamResponse,
  RequestStopStream,
  EventNewPreview,
  RequestFetchStream,
} from '@warpy/lib';
import { OnHostReassignFailed } from '../interfaces';
import { MediaModule, NjsMediaService } from './media';
import { PrismaModule, PrismaService } from './prisma';
import { EVENT_HOST_REASSIGN_FAILED } from '../utils';

@Injectable()
export class NjsStreamStore extends StreamStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsStreamService extends StreamService {
  constructor(
    streamStore: NjsStreamStore,
    mediaService: NjsMediaService,
    events: EventEmitter2,
  ) {
    super(streamStore, mediaService, events);
  }
}

@Controller()
export class StreamController implements OnHostReassignFailed {
  constructor(private streamService: NjsStreamService) {}

  @MessagePattern('stream.create')
  async createNewStream({
    title,
    category,
    user,
  }: RequestCreateStream): Promise<NewStreamResponse> {
    return this.streamService.createNewStream(user, title, category);
  }

  @OnEvent(EVENT_HOST_REASSIGN_FAILED)
  async onHostReassignFailed({ stream }) {
    await this.streamService.deleteStream(stream);
  }

  @MessagePattern('stream.stop')
  async stopStream({ user }: RequestStopStream) {
    await this.streamService.stopStream(user);
  }

  @MessagePattern('stream.new-preview')
  async onNewStreamPreview({ stream, preview }: EventNewPreview) {
    await this.streamService.setStreamPreview(stream, preview);
  }

  @MessagePattern('stream.get')
  async onStreamGet({ stream }: RequestFetchStream) {
    return {
      stream: await this.streamService.get(stream),
    };
  }
}

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [StreamController],
  providers: [NjsStreamService, NjsStreamStore],
  exports: [NjsStreamService, NjsStreamStore],
})
export class StreamModule {}
