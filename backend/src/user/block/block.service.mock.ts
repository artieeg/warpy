import { getMockedInstance } from '@backend_2/utils';
import { BlockService } from './block.service';

export const mockedBlockService = getMockedInstance<BlockService>(BlockService);
