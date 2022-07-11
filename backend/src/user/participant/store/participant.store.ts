import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParticipantStoreImpl } from 'lib/stores/participant';

@Injectable()
export class ParticipantStore
  extends ParticipantStoreImpl
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService);
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
