import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IRaiseHand,
  IRequestViewers,
  IRequestViewersResponse,
} from '@warpy/lib';
import { ViewerService } from './viewer.service';

@Controller()
export class ViewerController {
  constructor(private viewer: ViewerService) {}

  @MessagePattern('viewers.get')
  async onViewersRequest({
    stream,
    page,
  }: IRequestViewers): Promise<IRequestViewersResponse> {
    const viewers = await this.viewer.getViewers(stream, page);

    return { viewers };
  }

  @MessagePattern('user.raise-hand')
  async onRaiseHand({ user, flag }: IRaiseHand) {
    await this.viewer.setRaiseHand(user, flag);
  }
}
