import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserDataFetcherService } from '@warpy-be/app';
import { RequestUser, UserInfoResponse } from '@warpy/lib';
import { NjsUserStore, UserModule } from './user';
import { FollowModule, NjsFollowStore } from './follow';
import { NjsParticipantStore } from './participant';
import { NjsStreamStore, StreamModule } from './stream';

@Injectable()
export class NjsUserDataFetcherService extends UserDataFetcherService {
  constructor(
    userStore: NjsUserStore,
    followStore: NjsFollowStore,
    participantStore: NjsParticipantStore,
    streamStore: NjsStreamStore,
  ) {
    super(userStore, followStore, participantStore, streamStore);
  }
}

@Controller()
export class UserDataFetcherController {
  constructor(private userDataFetcher: NjsUserDataFetcherService) {}

  @MessagePattern('user.get')
  async onUserRequest({ user, id }: RequestUser): Promise<UserInfoResponse> {
    const data = await this.userDataFetcher.getUserInfo(id, user);

    return data;
  }
}

@Module({
  imports: [UserModule, StreamModule, FollowModule],
  providers: [NjsUserDataFetcherService],
  controllers: [UserDataFetcherController],
  exports: [],
})
export class UserDataFetcherModule {}
