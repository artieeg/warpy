import { Body, Controller, Post } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { UserClaimService } from './user-claim.service';

type ClaimUsernameDTO = {
  username: string;
  phone: string;
};

@Controller()
export class UserClaimController {
  constructor(private userClaimService: UserClaimService) {}

  @Post('/user/claim')
  async onClaimUsername(
    @Body() { username, phone }: ClaimUsernameDTO,
    @Req() req: any,
  ) {
    const ip: string =
      req.headers['x-forwarded-for'] ?? req.connection.remoteAddress;

    await this.userClaimService.createUsernameClaim(username, phone, ip);

    return {
      status: 'ok',
    };
  }
}
