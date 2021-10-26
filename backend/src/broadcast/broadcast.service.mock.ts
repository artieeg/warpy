import { BroadcastService } from './broadcast.service';
import { getMockedInstance } from '../utils';

export const mockedBroadcastService =
  getMockedInstance<BroadcastService>(BroadcastService);
