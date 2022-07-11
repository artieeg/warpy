import { Injectable } from '@nestjs/common';
import { FollowStore } from '@warpy-be/follow/follow.entity';
import { StreamStore } from '@warpy-be/stream/common/stream.entity';
import { NjsParticipantStore } from '@warpy-be/user/participant';
import { UserStoreService } from '@warpy-be/user/user.store';
import { UserDataFetcherService } from 'lib/services';

@Injectable()
export class NjsUserDataFetcherService extends UserDataFetcherService {
  constructor(
    user: UserStoreService,
    follow: FollowStore,
    participant: NjsParticipantStore,
    stream: StreamStore,
  ) {
    super(user, follow, participant, stream);
  }
}
