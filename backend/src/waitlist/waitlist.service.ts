import { WaitlistRecordExists } from '@backend_2/errors';
import { MailService } from '@backend_2/mail/mail.service';
import { TokenService } from '@backend_2/token/token.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { WaitlistEntity } from './waitlist.entity';

@Injectable()
export class WaitlistService {
  email_template: string;

  constructor(
    private config: ConfigService,
    private mail: MailService,
    private token: TokenService,
    private waitlistEntity: WaitlistEntity,
  ) {
    this.email_template = fs.readFileSync(
      './src/waitlist/template.html',
      'utf8',
    );
  }

  private async sendWelcomeEmail(email: string, username: string) {
    const url = this.config.get('url');
    const token = this.token.createToken({ email }, { expiresIn: '1y' });

    const unsub_link = url + '/waitlist/unsub?token=' + token;

    const html = this.email_template
      .replace('{unsub_link}', unsub_link)
      .replace('{reserved_username}', username);

    await this.mail.send({
      to: email,
      html,
      subject: 'warpy username has been reserved!',
    });
  }

  async addToWaitList(email: string, username: string) {
    try {
      const check = await this.waitlistEntity.check(email, username);

      if (!check) {
        throw new WaitlistRecordExists();
      }

      await this.sendWelcomeEmail(email, username);

      await this.waitlistEntity.add(email, username);
    } catch (e) {
      console.log('failed e');
      throw e;
    }
  }

  async removeFromWaitlist(token: string) {
    try {
      const { email } = this.token.validateToken(token);

      console.log(email);
      await this.waitlistEntity.del(email);
    } catch (e) {
      console.log('failed e');
      throw e;
    }
  }
}
