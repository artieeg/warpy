import { Injectable } from '@nestjs/common';
import { FollowStore } from '@warpy-be/follow/follow.entity';
import { StreamStore } from '@warpy-be/stream/common/stream.entity';
import { ParticipantStore } from '@warpy-be/user/participant';
import { UserStoreService } from '@warpy-be/user/user.store';
import { UserDataFetcher } from 'lib/services';

@Injectable()
export class UserDataFetcherService extends UserDataFetcher {
  constructor(
    user: UserStoreService,
    follow: FollowStore,
    participant: ParticipantStore,
    stream: StreamStore,
  ) {
    super(user, follow, participant, stream);
  }
}
