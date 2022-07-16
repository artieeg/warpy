import { getMockedInstance } from '@warpy-be/utils';
import { createFollowRecord } from '@warpy-be/__fixtures__';
import { NjsFollowStore } from './follow.entity';

export const mockedFollowEntity =
  getMockedInstance<NjsFollowStore>(NjsFollowStore);
