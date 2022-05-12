import { Controller } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { EVENT_USER_CONNECTED } from '@warpy-be/utils';
import { IWhoAmIRequest, IWhoAmIResponse } from '@warpy/lib';
import { SyncService } from './sync.service';

@Controller()
export class SyncController {
  constructor(
    private syncService: SyncService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('user.whoami-request')
  async onUserGet({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.syncService.sync(user);

    this.eventEmitter.emit(EVENT_USER_CONNECTED, { user });

    return data;
  }
}
