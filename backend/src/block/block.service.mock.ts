import { getMockedInstance } from '@warpy-be/utils';
import { NjsBlockService } from './block.service';

export const mockedBlockService =
  getMockedInstance<NjsBlockService>(NjsBlockService);
