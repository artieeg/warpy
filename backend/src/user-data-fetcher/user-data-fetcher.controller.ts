import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUserInfoResponse, IUserRequest } from '@warpy/lib';
import { UserDataFetcherService } from './user-data-fetcher.service';

@Controller()
export class UserDataFetcherController {
  constructor(private userDataFetcher: UserDataFetcherService) {}

  @MessagePattern('user.get')
  async onUserRequest({ user, id }: IUserRequest): Promise<IUserInfoResponse> {
    const data = await this.userDataFetcher.getUserInfo(id, user);

    return data;
  }
}
