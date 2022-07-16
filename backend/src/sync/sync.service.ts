import { Injectable } from '@nestjs/common';
import { SyncService } from 'lib';

@Injectable()
export class NjsSyncService extends SyncService {}
