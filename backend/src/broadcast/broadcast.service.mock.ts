import { NjsBroadcastService } from './broadcast.service';
import { getMockedInstance } from '../utils';

export const mockedBroadcastService =
  getMockedInstance<NjsBroadcastService>(NjsBroadcastService);
