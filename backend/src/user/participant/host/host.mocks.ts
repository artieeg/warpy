import { getMockedInstance } from '@warpy-be/utils';
import { NjsHostService } from './host.service';

export const mockedHostService =
  getMockedInstance<NjsHostService>(NjsHostService);
