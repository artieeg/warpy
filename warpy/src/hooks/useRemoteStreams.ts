import {useStore} from '@app/store';
import {useCallback, useEffect, useState} from 'react';
import {MediaStream} from 'react-native-webrtc';
import {useLocalVideoStream} from './useLocalStream';

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
    setStreams({
      videoStreams: Object.values(producers)
        .map(p => p.media?.video?.track)
        .filter(s => !!s) as any,
      audioStreams: Object.values(producers)
        .map(p => p.media?.audio?.track)
        .filter(s => !!s) as any,
    });
  }, [producers]);

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  return streams;
};
