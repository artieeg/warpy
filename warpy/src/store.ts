import {createNewStore, IStore} from '@warpy/store';
import {useCallback} from 'react';
import {mediaDevices} from 'react-native-webrtc';
import {StateSelector} from 'zustand';
import shallow from 'zustand/shallow';
import {navigation} from './navigation';

export * from '@warpy/store';

export const useStore = createNewStore({
  dependencies: {
    mediaDevices,
    openStream: id => {
      console.log('opening stream', id, navigation);
      navigation.current?.navigate('Stream', {
        stream: id,
      });
    },
  },
});

export function useStoreShallow<U>(selector: StateSelector<IStore, U>) {
  return useStore(useCallback(selector, []), shallow);
}
