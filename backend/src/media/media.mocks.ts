import { getMockedInstance } from '@warpy-be/utils';
import { MediaService } from './media.service';

export const mockedMediaService = getMockedInstance<MediaService>(MediaService);
