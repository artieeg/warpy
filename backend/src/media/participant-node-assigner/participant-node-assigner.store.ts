import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParticipantNodeAssignerStore } from 'lib/stores';

@Injectable()
export class NjsParticipantNodeAssignerStore
  extends ParticipantNodeAssignerStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('participantNodeAssignerAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
