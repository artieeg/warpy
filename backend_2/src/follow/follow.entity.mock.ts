import { getMockedInstance } from '@backend_2/utils';
import { createFollowRecord } from '@backend_2/__fixtures__';
import { FollowEntity } from './follow.entity';

export const mockedFollowEntity = getMockedInstance<FollowEntity>(FollowEntity);
