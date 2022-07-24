import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewUser, IUser } from '@warpy/lib';
import { RefreshTokenStore } from 'lib';
import { TokenService } from '../../token';
import { UserStore } from '../user.store';
import { UserCreator, UserCreatorImpl } from './UserCreator';
import { UserDeleter, UserDeleterImpl } from './UserDeleter';
import { UserSearcher, UserSearcherImpl } from './UserSearcher';
import { UserUpdater, UserUpdaterImpl } from './UserUpdater';

export class UserService {
  private creator: UserCreator;
  private searcher: UserSearcher;
  private updater: UserUpdater;
  private deleter: UserDeleter;

  constructor(
    user: UserStore,
    token: TokenService,
    refreshTokenStore: RefreshTokenStore,
    events: EventEmitter2,
  ) {
    this.creator = new UserCreatorImpl(user, token, refreshTokenStore, events);
    this.searcher = new UserSearcherImpl(user);
    this.updater = new UserUpdaterImpl(user);
    this.deleter = new UserDeleterImpl(user);
  }

  findById(user: string, details?: boolean) {
    return this.searcher.findById(user, details);
  }

  update(user: string, params: Partial<IUser>) {
    return this.updater.update(user, params);
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

  del(user: string) {
    return this.deleter.del(user);
  }
}
