import {useStore} from '@app/store';
import {useCallback, useState} from 'react';
import shallow from 'zustand/shallow';
import {useLocalAudioStream} from '.';

export const useNewStreamController = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, dispatchCreateStream] = useStore(
    state => [state.stream, state.dispatchStreamCreate],
    shallow,
  );

  useLocalAudioStream();

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    dispatchCreateStream(title, hub);
  }, [title, streamId, hub]);

  return {onStart, streamId, setTitle, setHub};
};
