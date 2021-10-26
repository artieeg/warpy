import {useStore} from '@app/store';
import {useCallback, useEffect, useState} from 'react';
import shallow from 'zustand/shallow';

export const useNewStreamController = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, dispatchCreateStream, dispatchMediaRequest] = useStore(
    state => [
      state.stream,
      state.dispatchStreamCreate,
      state.dispatchMediaRequest,
    ],
    shallow,
  );

  useEffect(() => {
    dispatchMediaRequest('audio', {enabled: true});
    dispatchMediaRequest('video', {enabled: true});
  }, []);

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    dispatchCreateStream(title, hub);
  }, [title, streamId, hub]);

  return {onStart, streamId, setTitle, setHub};
};
