import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewUser, IUser } from '@warpy/lib';
import { UserStore } from 'lib/stores';
import { FollowStore } from 'lib/stores/follow';
import { ParticipantStore } from 'lib/stores/participant';
import { RefreshTokenStore } from 'lib/stores/refresh-token';
import { StreamStore } from 'lib/stores/stream';
import { Token } from '../token';
import { UserCreator, UserCreatorImpl } from './UserCreator';
import { UserDataFetcher, UserDataFetcherImpl } from './UserDataFetcher';
import { UserDeleter, UserDeleterImpl } from './UserDeleter';
import { UserSearcher, UserSearcherImpl } from './UserSearcher';
import { UserUpdater, UserUpdaterImpl } from './UserUpdater';

export class User
  implements
    UserCreator,
    UserSearcher,
    UserUpdater,
    UserDataFetcher,
    UserDeleter
{
  private creator: UserCreator;
  private searcher: UserSearcher;
  private updater: UserUpdater;
  private fetcher: UserDataFetcher;
  private deleter: UserDeleter;

  constructor(
    user: UserStore,
    token: Token,
    refreshTokenStore: RefreshTokenStore,
    events: EventEmitter2,
    follow: FollowStore,
    participant: ParticipantStore,
    stream: StreamStore,
  ) {
    this.creator = new UserCreatorImpl(user, token, refreshTokenStore, events);
    this.searcher = new UserSearcherImpl(user);
    this.updater = new UserUpdaterImpl(user);
    this.fetcher = new UserDataFetcherImpl(user, follow, participant, stream);
    this.deleter = new UserDeleterImpl(user);
  }

  find(user: string, details?: boolean) {
    return this.fetcher.find(user, details);
  }

  getUserInfo(id: string, requester: string) {
    return this.fetcher.getUserInfo(id, requester);
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
