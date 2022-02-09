import { MailSendError } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sendgrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {
    sendgrid.setApiKey(config.get('sendGridKey'));
  }

  async send({
    from = 'hello@warpy.tv',
    ...rest
  }: {
    to: string;
    from?: string;
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
