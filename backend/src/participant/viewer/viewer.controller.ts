import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IJoinStream,
  IJoinStreamResponse,
  IRaiseHand,
  IRequestViewers,
  IRequestViewersResponse,
} from '@warpy/lib';
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