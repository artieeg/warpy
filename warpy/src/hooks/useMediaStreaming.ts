import {MediaStream} from 'react-native-webrtc';
import {MediaKind} from 'mediasoup-client/lib/types';
import {useEffect} from 'react';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const useMediaStreaming = ({
  stream,
  kind,
}: {
  stream?: MediaStream;
  kind: MediaKind;
}) => {
  const [sendMediaParams, id, mediaClient] = useStore(
    state => [state.sendMediaParams, state.stream, state.mediaClient],
    shallow,
  );

  useEffect(() => {
    if (sendMediaParams && id && stream) {
      mediaClient?.sendMediaStream(stream, id, sendMediaParams, kind);
    }
  }, [mediaClient, sendMediaParams, id, stream]);
};
