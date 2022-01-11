import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IFeedResponse, IRequestFeed } from '@warpy/lib';
import { FeedService } from './feed.service';

@Controller()
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('feeds.get')
  async getStreamFeed({
    user,
    category,
  }: IRequestFeed): Promise<IFeedResponse> {
    const feed = await this.feedService.getFeed(user, category);

    return {
      feed,
    };
  }
}
