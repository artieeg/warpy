import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MemberIdsStoreBehaviour } from '@warpy-be/shared/stream-participant-ids-store.behaviour';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class ChatMemberStore implements OnModuleInit {
  redis: Redis;
  streamMemberIdsStore: MemberIdsStoreBehaviour;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('chatMemberStoreAddr'));

    this.streamMemberIdsStore = new MemberIdsStoreBehaviour(
      this.redis,
      'stream_chat_members_',
    );
  }

  async addChatMember(stream: string, user: string) {
    return this.streamMemberIdsStore.addMember(stream, user);
  }

  async deleteChatMembers(stream: string) {
    return this.streamMemberIdsStore.deleteMembers(stream);
  }

  async deleteChatMember(stream: string, user: string) {
    return this.streamMemberIdsStore.deleteMember(stream, user);
  }
}
