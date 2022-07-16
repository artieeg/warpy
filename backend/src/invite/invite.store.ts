import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InviteStore } from 'lib';

@Injectable()
export class NjsInviteStore extends InviteStore implements OnModuleInit {
  constructor(configService: ConfigService) {
    super(configService.get('inviteStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
