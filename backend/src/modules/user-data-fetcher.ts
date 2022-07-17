import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserDataFetcherService } from 'lib';
import { IUserRequest, IUserInfoResponse } from '@warpy/lib';
import { NjsUserStore, UserModule } from './user';
import { NjsFollowStore } from './follow';
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
  async onUserRequest({ user, id }: IUserRequest): Promise<IUserInfoResponse> {
    const data = await this.userDataFetcher.getUserInfo(id, user);

    return data;
  }
}

@Module({
  imports: [UserModule, StreamModule],
  providers: [NjsUserDataFetcherService],
  controllers: [UserDataFetcherController],
  exports: [],
})
export class UserDataFetcherModule {}
