import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMemberStore } from 'lib/stores';

@Injectable()
export class NjsChatMemberStore
  extends ChatMemberStore
  implements OnModuleInit
{
  constructor(config: ConfigService) {
    super(config.get('chatMemberStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
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
