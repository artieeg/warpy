import { getMockedInstance } from '@warpy-be/utils';
import { ViewerService } from './viewer.service';

export const mockedViewerService =
  getMockedInstance<ViewerService>(ViewerService);
