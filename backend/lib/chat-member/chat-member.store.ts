import { ListStoreBehaviour } from '@warpy-be/shared';
import IORedis, { Redis } from 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

export interface IChatMemberStore extends OnInstanceInit {}

export class ChatMemberStore implements IChatMemberStore {
  redis: Redis;
  chatMembers: ListStoreBehaviour;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.redis = new IORedis(this.uri);

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
