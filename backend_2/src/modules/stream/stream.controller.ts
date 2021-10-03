import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { INewStream, INewStreamResponse } from '@warpy/lib';
import { StreamService } from './stream.service';

@Controller()
export class StreamController {
  constructor(private streamService: StreamService) {}

  @MessagePattern('stream.create')
  async createNewStream({
    title,
    hub,
    user,
  }: INewStream): Promise<INewStreamResponse> {
    const response = await this.streamService.createNewStream(user, title, hub);

    return response;
  }
}
