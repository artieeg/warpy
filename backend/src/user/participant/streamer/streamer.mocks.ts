import { getMockedInstance } from '@warpy-be/utils';
import { StreamerService } from './streamer.service';

export const mockedStreamerService =
  getMockedInstance<StreamerService>(StreamerService);
