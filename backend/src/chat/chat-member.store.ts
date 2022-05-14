import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ListStoreBehaviour } from '@warpy-be/shared';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class ChatMemberStore implements OnModuleInit {
  redis: Redis;
  chatMembers: ListStoreBehaviour;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('chatMemberStoreAddr'));

    this.chatMembers = new ListStoreBehaviour(
      this.redis,
      'stream_chat_members_',
    );
  }

  async addChatMember(stream: string, user: string) {
    return this.chatMembers.addItem(stream, user);
  }

  async deleteChatMembers(stream: string) {
    return this.chatMembers.deleteList(stream);
  }

  async deleteChatMember(stream: string, user: string) {
    return this.chatMembers.deleteItem(stream, user);
  }
}
