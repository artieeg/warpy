import {useMediaStreamingContext} from '@app/components';
import {Consumer, Transport} from 'mediasoup-client/lib/types';
import {useEffect, useRef, useState} from 'react';
import {MediaStream} from 'react-native-webrtc';
import {useAppUser} from './useAppUser';

interface IStreams {
  videoStreams: MediaStream[];
  audioStreams: MediaStream[];
}

export const useRemoteStreams = (streamId: string, transport?: Transport) => {
  const media = useMediaStreamingContext();
  const [streams, setStreams] = useState<IStreams>({
    videoStreams: [],
    audioStreams: [],
  });

  const {id: userId} = useAppUser();

  const fetched = useRef(false);

  useEffect(() => {
    if (!transport || !media.permissionsToken || fetched.current) {
      return;
    }

    media
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
  }, [transport, media.permissionsToken]);

  return streams;
};
