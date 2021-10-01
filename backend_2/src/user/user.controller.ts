import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IWhoAmIRequest, IWhoAmIResponse } from '@warpy/lib';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern('user.whoami-request')
  async getUserData({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.userService.getById(user);

    console.log('user', data);
    return {
      user: data,
      following: [],
    };
  }
}
