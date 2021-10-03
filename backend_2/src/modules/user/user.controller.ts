import { UserNotFound } from '@backend_2/errors';
import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUserDisconnected, IWhoAmIRequest, IWhoAmIResponse } from '@warpy/lib';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.whoami-request')
  async getUserData({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.userService.getById(user);

    return {
      user: data,
      following: [],
    };
  }
}
