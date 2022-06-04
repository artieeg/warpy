import { getMockedInstance } from '@warpy-be/utils';
import { HostService } from './host.service';

export const mockedHostService = getMockedInstance<HostService>(HostService);
