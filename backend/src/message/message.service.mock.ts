import { getMockedInstance } from '@warpy-be/utils';
import { NjsMessageService } from './message.service';

export const mockedMessageService =
  getMockedInstance<NjsMessageService>(NjsMessageService);
