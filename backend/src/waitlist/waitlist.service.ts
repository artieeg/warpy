import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WaitlistService {
  constructor(private config: ConfigService) {}

  private verifyEmail(address: string): boolean {
    return false;
  }

  private async sendWelcomeEmail(address: string) {}

  async addToWaitList(email: string, username: string) {}
}
