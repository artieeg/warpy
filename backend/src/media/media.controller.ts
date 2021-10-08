import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { INewMediaNode } from '@warpy/lib';
import { MediaService } from './media.service';

@Controller()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @MessagePattern('media.node.is-online')
  async onNewMediaNode({ id, role }: INewMediaNode) {
    await this.mediaService.addNewMediaNode(id, role);
  }
}
