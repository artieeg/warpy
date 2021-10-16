import {useStore} from '@app/store';
import {useCallback, useEffect, useState} from 'react';
import {MediaStream} from 'react-native-webrtc';

interface IStreams {
  videoStreams: MediaStream[];
  audioStreams: MediaStream[];
}

export const useRemoteStreams = () => {
  const [streams, setStreams] = useState<IStreams>({
    videoStreams: [],
    audioStreams: [],
  });

  const producers = useStore.use.producers();

  const getStreams = useCallback(() => {
    let newVideoStreams = [] as MediaStream[];
    let newAudioStreams = [] as MediaStream[];

    Object.values(producers).forEach(producer => {
      if (producer.media?.audio) {
        newAudioStreams.push(new MediaStream([producer.media?.audio]));
      }

      if (producer.media?.video) {
        newVideoStreams.push(new MediaStream([producer.media?.video]));
      }
    });

    setStreams({
      videoStreams: newVideoStreams,
      audioStreams: newAudioStreams,
    });
  }, [producers]);

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  return streams;
};
