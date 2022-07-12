import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeRegistryStore } from 'lib/stores';

@Injectable()
/** Stores arrays of online send/recv media nodes */
export class NjsNodeRegistryStore
  extends NodeRegistryStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('mediaServerIdsCache'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
