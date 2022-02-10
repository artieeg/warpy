import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { validate } from 'email-validator';
import { WaitlistRecordExists } from '@backend_2/errors';

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
      return res.status(400).json({});
    }

    try {
      await this.waitlistService.addToWaitList(email, username);

      res.status(200).json({});
    } catch (e) {
      if (e instanceof WaitlistRecordExists) {
        res.status(400).json({
          field: e.field,
        });
      } else {
        res.status(500).json({});
      }
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
