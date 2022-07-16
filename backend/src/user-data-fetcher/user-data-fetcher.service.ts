import { Injectable } from '@nestjs/common';
import { NjsFollowStore } from '@warpy-be/follow/follow.entity';
import { NjsStreamStore } from '@warpy-be/stream/common/stream.entity';
import { NjsParticipantStore } from '@warpy-be/user/participant';
import { NjsUserStore } from '@warpy-be/user/user.store';
import { UserDataFetcherService } from 'lib/services';

@Injectable()
export class NjsUserDataFetcherService extends UserDataFetcherService {
  constructor(
    user: NjsUserStore,
    follow: NjsFollowStore,
    participant: NjsParticipantStore,
    stream: NjsStreamStore,
  ) {
    super(user, follow, participant, stream);
  }
}
