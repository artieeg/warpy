import { getMockedInstance } from '@warpy-be/utils';
import { BlockService } from './block.service';

export const mockedBlockService = getMockedInstance<BlockService>(BlockService);
