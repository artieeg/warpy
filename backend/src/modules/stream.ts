import { Injectable, Controller, Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { StreamService, StreamStore } from 'lib';
import {
  INewStream,
  INewStreamResponse,
  IStopStream,
  INewPreviewEvent,
  IStreamGetRequest,
} from '@warpy/lib';
import { OnHostReassignFailed, OnHostReassign } from '../interfaces';
import { MediaModule } from './media';
import { PrismaModule } from './prisma';
import { EVENT_HOST_REASSIGN, EVENT_HOST_REASSIGN_FAILED } from '../utils';

@Injectable()
class NjsStreamStoreProvider extends StreamStore {}

@Injectable()
class NjsStreamServiceProvider extends StreamService {}

@Controller()
class StreamController implements OnHostReassignFailed, OnHostReassign {
  constructor(private streamService: NjsStreamServiceProvider) {}

  @MessagePattern('stream.create')
  async createNewStream({
    title,
    category,
    user,
  }: INewStream): Promise<INewStreamResponse> {
    return this.streamService.createNewStream(user, title, category);
  }

  @OnEvent(EVENT_HOST_REASSIGN)
  async onHostReassign({ stream, host }) {
    await this.streamService.setStreamHost(stream, host.id);
  }

  @OnEvent(EVENT_HOST_REASSIGN_FAILED)
  async onHostReassignFailed({ stream }) {
    await this.streamService.deleteStream(stream);
  }

  @MessagePattern('stream.stop')
  async stopStream({ user }: IStopStream) {
    await this.streamService.stopStream(user);
  }

  @MessagePattern('stream.new-preview')
  async onNewStreamPreview({ stream, preview }: INewPreviewEvent) {
    await this.streamService.setStreamPreview(stream, preview);
  }

  @MessagePattern('stream.get')
  async onStreamGet({ stream }: IStreamGetRequest) {
    return {
      stream: await this.streamService.get(stream),
    };
  }
}

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [StreamController],
  providers: [NjsStreamServiceProvider, NjsStreamStoreProvider],
  exports: [NjsStreamServiceProvider],
})
export class StreamModule {}
