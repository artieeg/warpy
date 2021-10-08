import { getMockedInstance } from '@backend_2/utils';
import { MediaCacheService } from './media.cache';

export const mockedMediaCache =
  getMockedInstance<MediaCacheService>(MediaCacheService);
