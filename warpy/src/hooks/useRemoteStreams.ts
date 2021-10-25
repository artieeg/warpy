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

  const streamers = useStore.use.streamers();

  const getStreams = useCallback(() => {
    setStreams({
      videoStreams: Object.values(streamers)
        .map(p => p.media?.video?.track)
        .filter(s => !!s) as any,
      audioStreams: Object.values(streamers)
        .map(p => p.media?.audio?.track)
        .filter(s => !!s) as any,
    });
  }, [streamers]);

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  return streams;
};
