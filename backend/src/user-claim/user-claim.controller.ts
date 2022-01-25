import { Body, Controller, Post } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';

type ClaimUsernameDTO = {
  username: string;
  phone: string;
};

@Controller()
export class UserClaimController {
  constructor() {}

  @Post('/user/claim')
  async onClaimUsername(
    @Body() { username, phone }: ClaimUsernameDTO,
    @Req() req: any,
  ) {
    const ip: string =
      req.headers['x-forwarded-for'] ?? req.connection.remoteAddress;
    const hash = ip.split('').reduce((hash, v) => hash + v.charCodeAt(0), 0);

    return {
      status: 'ok',
    };
  }
}
