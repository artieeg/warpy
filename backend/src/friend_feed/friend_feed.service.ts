import { Injectable } from '@nestjs/common';
import { FriendFeedService } from 'lib';

@Injectable()
export class NjsFriendFeedService extends FriendFeedService {}
