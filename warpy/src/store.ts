import {createNewStore, IStore} from '@warpy/store';
import {useCallback} from 'react';
import {mediaDevices} from 'react-native-webrtc';
import {StateSelector} from 'zustand';
import shallow from 'zustand/shallow';

export * from '@warpy/store';

export const useStore = createNewStore({
  dependencies: {
    mediaDevices,
  },
});

export function useStoreShallow<U>(selector: StateSelector<IStore, U>) {
  return useStore(useCallback(selector, []), shallow);
}
