import { Body, Controller, Post } from '@nestjs/common';

type ClaimUsernameDTO = {
  username: string;
  phone: string;
};

@Controller()
export class BotsController {
  constructor() {}

  @Post('/user/claim')
  async onClaimUsername(@Body() { username, phone }: ClaimUsernameDTO) {}
}
