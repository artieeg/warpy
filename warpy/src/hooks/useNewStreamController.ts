import {useStore} from '@app/store';
import {useCallback, useState} from 'react';
import shallow from 'zustand/shallow';
import {useLocalAudioStream} from '.';

export const useNewStreamController = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, createStream, api] = useStore(
    state => [state.stream, state.create, state.api],
    shallow,
  );

  useLocalAudioStream();

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    createStream(title, hub);
  }, [title, streamId, hub, api]);

  return {onStart, streamId, setTitle, setHub};
};
