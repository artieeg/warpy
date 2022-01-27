import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class PhoneNumberService {
  client: Twilio;

  constructor(private configService: ConfigService) {}

  async sendMessage(phone: string, content: string) {}
}
