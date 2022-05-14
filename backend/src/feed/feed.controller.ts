import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IFeedResponse,
  IRequestFeed,
  IStreamSearchRequest,
  IStreamSearchResponse,
} from '@warpy/lib';
import { FeedService } from './feed.service';

@Controller()
export class FeedController {
  constructor(private candidateService: FeedService) {}

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
