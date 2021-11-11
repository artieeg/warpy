import {IInvite} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IInviteSlice {
  pendingInviteUserIds: string[];
  sentInvites: Record<string, IInvite>;
}

export const createInviteSlice: StoreSlice<IInviteSlice> = () => ({
  pendingInviteUserIds: [],
  sentInvites: {},
});
