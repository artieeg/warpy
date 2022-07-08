import AsyncStorage from '@react-native-async-storage/async-storage';
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
    saveReaction: code => {
      AsyncStorage.setItem('reaction', code);
    },
    openStream: id => {
      navigation.current?.navigate('Stream', {
        stream: id,
      });
    },
  },
});

export function useStoreShallow<U>(selector: StateSelector<IStore, U>) {
  return useStore(useCallback(selector, []), shallow);
}

export function useDispatcher() {
  return useStore(state => state.dispatch);
}
