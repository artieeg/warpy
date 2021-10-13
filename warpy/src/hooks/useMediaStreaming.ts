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
  const [sendTransport, id, mediaClient] = useStore(
    state => [state.sendTransport, state.stream, state.mediaClient],
    shallow,
  );

  useEffect(() => {
    if (sendTransport && id && stream) {
      mediaClient?.sendMediaStream(
        kind === 'audio'
          ? stream.getAudioTracks()[0]
          : stream.getVideoTracks()[0],
        kind,
        sendTransport,
      );
    }
  }, [mediaClient, sendTransport, id, stream]);
};
