import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FeedService } from '@warpy-be/app';
import {
  IStreamSearchRequest,
  IStreamSearchResponse,
  IRequestFeed,
  IFeedResponse,
} from '@warpy/lib';
import { NjsUserBlockService, UserBlockModule } from './user-block';
import { NjsParticipantStore } from './participant';
import { PrismaModule } from './prisma';
import { NjsStreamStore, StreamModule } from './stream';
import { UserModule } from './user';

@Injectable()
export class NjsFeedService extends FeedService {
  constructor(
    userBlockService: NjsUserBlockService,
    streamStore: NjsStreamStore,
    participantStore: NjsParticipantStore,
  ) {
    super(userBlockService, streamStore, participantStore);
  }
}

@Controller()
export class FeedController {
  constructor(private candidateService: NjsFeedService) {}

  @MessagePattern('candidate.search')
  async onSearch({
    textToSearch,
  }: IStreamSearchRequest): Promise<IStreamSearchResponse> {
    const candidates = await this.candidateService.search(textToSearch);

    return { streams: candidates };
  }

  @MessagePattern('candidate.get')
  async getStreamFeed({
    user,
    category,
  }: IRequestFeed): Promise<IFeedResponse> {
    const feed = await this.candidateService.getFeed(user, category);

    return {
      feed,
    };
  }
}

@Module({
  imports: [PrismaModule, StreamModule, UserBlockModule, UserModule],
  providers: [NjsFeedService],
  controllers: [FeedController],
})
export class FeedModule {}
