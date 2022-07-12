import { getMockedInstance } from '@warpy-be/utils';
import { NjsMediaService } from './media.service';

export const mockedMediaService =
  getMockedInstance<NjsMediaService>(NjsMediaService);
