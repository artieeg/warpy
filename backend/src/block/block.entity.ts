import { Injectable } from '@nestjs/common';
import { UserBlockStore } from 'lib/stores/user-block';

@Injectable()
export class NjsBlockStore extends UserBlockStore {}
