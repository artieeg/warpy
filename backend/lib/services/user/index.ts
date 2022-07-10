import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewUser } from '@warpy/lib';
import { UserStore } from 'lib/stores';
import { RefreshTokenStore } from 'lib/stores/refresh-token';
import { Token } from '../token';
import { UserCreator, UserCreatorImpl } from './UserCreator';

export class User implements UserCreator {
  private creator: UserCreator;

  constructor(
    user: UserStore,
    token: Token,
    refreshTokenStore: RefreshTokenStore,
    events: EventEmitter2,
  ) {
    this.creator = new UserCreatorImpl(user, token, refreshTokenStore, events);
  }

  createAnonUser() {
    return this.creator.createAnonUser();
  }

  createUser(data: INewUser) {
    return this.creator.createUser(data);
  }
}
