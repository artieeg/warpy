import { MailService } from '@backend_2/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WaitlistService {
  constructor(private config: ConfigService, private mail: MailService) {}

  private async sendWelcomeEmail(address: string) {}

  async addToWaitList(email: string, username: string) {
    try {
      const result = await this.mail.send({
        to: email,
        html: `<span>your username <strong>${username}</strong> has been reserved</span>`,
        subject: 'username reservation',
      });
    } catch (e) {
      console.log('failed e');
      throw e;
    }
  }
}
