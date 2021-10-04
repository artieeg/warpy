import { UserNotFound } from '@backend_2/errors';
import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  INewUser,
  INewUserResponse,
  IUserDisconnected,
  IWhoAmIRequest,
  IWhoAmIResponse,
} from '@warpy/lib';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.whoami-request')
  async onUserGet({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.userService.getById(user);

    return {
      user: data,
      following: [],
    };
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.create')
  async onUserCreate(data: INewUser): Promise<INewUserResponse> {
    if (process.env.NODE !== 'production' && data.kind === 'dev') {
      return this.userService.createDevUser(data);
    }
  }
}
