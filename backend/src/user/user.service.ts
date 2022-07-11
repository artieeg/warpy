import { ParticipantStore } from '@warpy-be/user/participant/store';
import { Injectable } from '@nestjs/common';
import {
  INewUser,
  INewUserResponse,
  IUser,
  IUserInfoResponse,
} from '@warpy/lib';
import { RefreshTokenEntity } from '../token/refresh-token.entity';
import { TokenService } from '../token/token.service';
import { UserStoreService } from './user.store';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FollowStore } from '@warpy-be/follow/follow.entity';
import { User } from 'lib/services';
import { StreamStore } from 'lib/stores';

@Injectable()
export class UserService extends User {
  constructor(
    store: UserStoreService,
    tokenService: TokenService,
    refreshTokenEntity: RefreshTokenEntity,
    events: EventEmitter2,

    followEntity: FollowStore,
    participantEntity: ParticipantStore,
    streamEntity: StreamStore,
  ) {
    super(
      store,
      tokenService,
      refreshTokenEntity,
      events,
      followEntity,
      participantEntity,
      streamEntity,
    );
  }
}
