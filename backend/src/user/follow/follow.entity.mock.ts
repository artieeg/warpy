import { getMockedInstance } from '@warpy-be/utils';
import { createFollowRecord } from '@warpy-be/__fixtures__';
import { FollowEntity } from './follow.entity';

export const mockedFollowEntity = getMockedInstance<FollowEntity>(FollowEntity);
