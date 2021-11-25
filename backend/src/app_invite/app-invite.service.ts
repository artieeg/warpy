import { Injectable } from '@nestjs/common';
import { AppInviteEntity } from './app-invite.entity';

@Injectable()
export class AppInviteService {
  constructor(private appInviteEntity: AppInviteEntity) {}

  async get(user_id: string) {
    return this.appInviteEntity.find(user_id);
  }
}
