import { getMockedInstance } from '@warpy-be/utils';
import { MediaCacheService } from './media.cache';

export const mockedMediaCache =
  getMockedInstance<MediaCacheService>(MediaCacheService);
