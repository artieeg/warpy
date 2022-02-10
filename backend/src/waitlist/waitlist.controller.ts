import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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

    try {
      await this.waitlistService.addToWaitList(email, username);

      res.status(200).json({});
    } catch (e) {
      res.status(400).json({});
    }
  }

  @Get('/waitlist/unsub')
  async onDelete(@Query('token') token: string, @Res() res: any) {
    try {
      await this.waitlistService.removeFromWaitlist(token);
    } catch (e) {
      console.log('failed to delete from waitlist', token);
    } finally {
      res.status(200).send('you have been removed from the waitlist');
    }
  }
}
