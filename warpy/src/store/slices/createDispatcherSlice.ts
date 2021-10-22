import {Roles} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IDispatcherSlice {
  dispatchRoleUpdate: (
    role: Roles,
    mediaPermissionToken: string,
    sendMediaParams?: any,
  ) => Promise<void>;
}

export const createDispatcherSlice: StoreSlice<IDispatcherSlice> = (
  set,
  get,
) => ({
  async dispatchRoleUpdate(role, mediaPermissionToken, sendMediaParams) {
    const oldRole = get().role;

    if (sendMediaParams) {
      set({sendMediaParams, role});
    } else {
      set({role});
    }

    if (role === 'viewer') {
      get().closeProducers(['audio', 'video']);
    } else if (role === 'speaker') {
      get().closeProducers(['video']);
    }

    if (oldRole === 'streamer' && role === 'speaker') {
      return;
    } else {
      const kind = role === 'speaker' ? 'audio' : 'video';
      await get().sendMedia(mediaPermissionToken, [kind]);
    }
  },
});
