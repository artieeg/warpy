import { getMockedInstance } from '@warpy-be/utils';
import { createFollowRecord } from '@warpy-be/__fixtures__';
import { FollowStore } from './follow.entity';

export const mockedFollowEntity = getMockedInstance<FollowStore>(FollowStore);
