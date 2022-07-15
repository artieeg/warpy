import { Injectable } from '@nestjs/common';
import { FeedService } from 'lib/services/feed';

@Injectable()
export class NjsFeedService extends FeedService {}
