import { Body, Controller, Post, Res } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { validate } from 'email-validator';

type NewWaitlistRecord = {
  username: string;
  email: string;
};

@Controller()
export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  @Post('/waitlist/user')
  async onNewWaitlistRecord(
    @Body() { username, email }: NewWaitlistRecord,
    @Res() res: any,
  ) {
    if (!validate(email)) {
      res.status(400).json({});
    }

    await this.waitlistService.addToWaitList(email, username);

    res.status(200).json({});
  }
}
