import { getMockedInstance } from '@warpy-be/utils';
import { NjsBotStore } from './bots.entity';

export const mockedBotsEntity = getMockedInstance<NjsBotStore>(NjsBotStore);
