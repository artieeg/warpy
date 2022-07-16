import { MailSendError } from '@warpy-be/errors';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sendgrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(config: ConfigService) {
    sendgrid.setApiKey(config.get('sendGridKey'));
  }

  async send({
    from = { email: 'hello@warpy.tv', name: 'warpy' },
    ...rest
  }: {
    to: string;
    from?: { email: string; name: string };
    subject: string;
    html: string;
  }) {
    try {
      await sendgrid.send({ ...rest, from });
    } catch (e) {
      console.log(e);
      console.log(e.response.body.errors);
      throw new MailSendError();
    }
  }
}
