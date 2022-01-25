import { Injectable } from '@nestjs/common';
import { UsernameClaimEntity } from './username-claim.entity';

@Injectable()
export class UserClaimService {
  constructor(private usernameClaimEntity: UsernameClaimEntity) {}

  async createUsernameClaim(username: string, phone: string, ip: string) {
    //Simple, might work :) 🤞
    const hash = ip.split('').reduce((hash, v) => hash + v.charCodeAt(0), 0);

    //TODO: twilio phone number validations

    await this.usernameClaimEntity.create({
      username,
      phone,
      hash,
    });
  }
}
