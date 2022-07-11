import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParticipantStore } from 'lib/stores/participant';

@Injectable()
export class NjsParticipantStore
  extends ParticipantStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService);
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
