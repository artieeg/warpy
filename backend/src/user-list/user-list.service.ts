import { Injectable } from '@nestjs/common';
import { UserListFetcherService } from 'lib';

@Injectable()
export class NjsUserListService extends UserListFetcherService {}
