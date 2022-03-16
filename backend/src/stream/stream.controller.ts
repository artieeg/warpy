import { OnHostReassign, OnHostReassignFailed } from '@warpy-be/interfaces';
import {
  EVENT_HOST_REASSIGN,
  EVENT_HOST_REASSIGN_FAILED,
} from '@warpy-be/utils';
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
export class StreamController implements OnHostReassignFailed, OnHostReassign {
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

  @OnEvent(EVENT_HOST_REASSIGN)
  async onHostReassign({ stream, host }) {
    this.streamService.setStreamHost(stream, host);
  }

  @OnEvent(EVENT_HOST_REASSIGN_FAILED)
  async onHostReassignFailed({ stream }) {
    this.streamService.deleteStream(stream);
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
