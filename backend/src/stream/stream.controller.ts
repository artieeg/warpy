import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  INewPreviewEvent,
  INewStream,
  INewStreamResponse,
  IStopStream,
  IStreamGetRequest,
  IStreamSearchRequest,
  IStreamSearchResponse,
} from '@warpy/lib';
import { StreamService } from './stream.service';

@Controller()
export class StreamController {
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

  @MessagePattern('stream.search')
  async onSearch({
    textToSearch,
  }: IStreamSearchRequest): Promise<IStreamSearchResponse> {
    const streams = await this.streamService.search(textToSearch);

    return { streams };
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
