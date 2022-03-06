import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IJoinStream, IJoinStreamResponse } from '@warpy/lib';
import { ViewerService } from './viewer.service';

@Controller()
export class ViewerController {
  constructor(private viewer: ViewerService) {}

  @MessagePattern('stream.join')
  async onNewViewer({
    stream,
    user,
  }: IJoinStream): Promise<IJoinStreamResponse> {
    return this.viewer.createNewViewer(stream, user);
  }
}
