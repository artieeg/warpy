import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserDataFetcherService } from 'lib';
import { UserModule, StreamModule } from '.';
import { IUserRequest, IUserInfoResponse } from '@warpy/lib';

@Injectable()
export class NjsUserDataFetcherService extends UserDataFetcherService {}

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
