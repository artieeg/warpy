import {useStore} from '@app/store';
import {Consumer} from 'mediasoup-client/lib/types';
import {useEffect, useRef, useState} from 'react';
import {MediaStream} from 'react-native-webrtc';
import shallow from 'zustand/shallow';
import {useAppUser} from './useAppUser';
import {useRecvTransport} from './useRecvTransport';

interface IStreams {
  videoStreams: MediaStream[];
  audioStreams: MediaStream[];
}

export const useRemoteStreams = () => {
  const [roomData, streamId] = useStore(
    state => [state.recvMediaParams, state.stream],
    shallow,
  );

  const transport = useRecvTransport();

  const [mediaClient, mediaPermissionsToken] = useStore(
    state => [state.mediaClient, state.mediaPermissionsToken],
    shallow,
  );

  const [streams, setStreams] = useState<IStreams>({
    videoStreams: [],
    audioStreams: [],
  });

  const {id: userId} = useAppUser();

  const fetched = useRef(false);

  useEffect(() => {
    console.log(
      !!streamId,
      !!transport,
      !!mediaClient,
      !!mediaPermissionsToken,
      !!fetched.current,
    );
    if (
      !streamId ||
      !transport ||
      !mediaClient ||
      !mediaPermissionsToken ||
      fetched.current
    ) {
      return;
    }

    mediaClient
      .consumeRemoteStreams(userId, streamId, transport)
      .then((consumers: Consumer[]) => {
        const videoStreams: MediaStream[] = [];
        const audioStreams: MediaStream[] = [];

        consumers.forEach(consumer => {
          const stream = new MediaStream([consumer.track]);

          if (consumer.kind === 'video') {
            videoStreams.push(stream);
          } else {
            audioStreams.push(stream);
          }
        });

        fetched.current = true;

        setStreams({
          videoStreams,
          audioStreams,
        });
      });
  }, [transport, mediaPermissionsToken, streamId]);

  return streams;
};
