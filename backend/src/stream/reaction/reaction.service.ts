import { Injectable } from '@nestjs/common';
import { ReactionService } from 'lib';

@Injectable()
export class NjsReactionService extends ReactionService {
  onModuleInit() {
    this.onInstanceInit();
  }

  onModuleDestroy() {
    this.onInstanceDestroy();
  }
}
