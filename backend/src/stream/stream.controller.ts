import { OnUserDisconnect } from '@backend_2/interfaces';
import { EVENT_USER_DISCONNECTED } from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  INewPreviewEvent,
  INewStream,
  INewStreamResponse,
  IStopStream,
  IStreamGetRequest,
} from '@warpy/lib';
import { StreamService } from './stream.service';

@Controller()
export class StreamController implements OnUserDisconnect {
  constructor(private streamService: StreamService) {}

  @MessagePattern('stream.create')
  async createNewStream({
    title,
    category,
    user,
  }: INewStream): Promise<INewStreamResponse> {
    const response = await this.streamService.createNewStream(
      user,
      title,
      category,
    );

    return response;
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    console.log('diconencted', { user });
    try {
      await this.streamService.stopStream(user);
    } catch (e) {}
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
    const data = await this.streamService.get(stream);

    return { stream: data };
  }
}
