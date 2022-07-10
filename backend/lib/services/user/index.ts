import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewUser } from '@warpy/lib';
import { UserStore } from 'lib/stores';
import { RefreshTokenStore } from 'lib/stores/refresh-token';
import { Token } from '../token';
import { UserCreator, UserCreatorImpl } from './UserCreator';
import { UserSearcher, UserSearcherImpl } from './UserSearcher';

export class User implements UserCreator, UserSearcher {
  private creator: UserCreator;
  private searcher: UserSearcher;

  constructor(
    user: UserStore,
    token: Token,
    refreshTokenStore: RefreshTokenStore,
    events: EventEmitter2,
  ) {
    this.creator = new UserCreatorImpl(user, token, refreshTokenStore, events);
    this.searcher = new UserSearcherImpl(user);
  }

  createAnonUser() {
    return this.creator.createAnonUser();
  }

  createUser(data: INewUser) {
    return this.creator.createUser(data);
  }

  search(text: string, requester_id: string) {
    return this.searcher.search(text, requester_id);
  }
}
