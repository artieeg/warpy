import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity } from '../token/refresh-token.entity';
import { TokenService } from '../token/token.service';
import { UserStoreService } from './user.store';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'lib/services';

@Injectable()
export class UserService extends User {
  constructor(
    store: UserStoreService,
    tokenService: TokenService,
    refreshTokenEntity: RefreshTokenEntity,
    events: EventEmitter2,
  ) {
    super(store, tokenService, refreshTokenEntity, events);
  }
}
