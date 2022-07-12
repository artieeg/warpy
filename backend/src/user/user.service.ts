import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity } from '../token/refresh-token.entity';
import { NJTokenService } from '../token/token.service';
import { NjsUserStore } from './user.store';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from 'lib/services';

@Injectable()
export class NjsUserService extends UserService {
  constructor(
    store: NjsUserStore,
    tokenService: NJTokenService,
    refreshTokenEntity: RefreshTokenEntity,
    events: EventEmitter2,
  ) {
    super(store, tokenService, refreshTokenEntity, events);
  }
}
