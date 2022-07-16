import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FeedService } from 'lib';
import { PrismaModule, StreamModule, UserBlockModule, UserModule } from '.';
import {
  IStreamSearchRequest,
  IStreamSearchResponse,
  IRequestFeed,
  IFeedResponse,
} from '@warpy/lib';

@Injectable()
export class NjsFeedService extends FeedService {}

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
    console.log({ user, category });

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
