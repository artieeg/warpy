import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WaitlistService {
  constructor(private config: ConfigService) {}

  private async sendWelcomeEmail(address: string) {}

  async addToWaitList(email: string, username: string) {}
}
