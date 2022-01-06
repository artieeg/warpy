import {useStore, useStoreShallow} from '@app/store';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {MediaStream} from 'react-native-webrtc';

interface IStreams {
  videoStreams: MediaStream[];
  audioStreams: MediaStream[];
}

export const useRemoteStreams = () => {
  /*
  const [streams, setStreams] = useState<IStreams>({
    videoStreams: [],
    audioStreams: [],
  });
  */

  /*
  const streamers = useStore(
    state => state.streamers,
    (a, b) => {
      return JSON.stringify(a.streamers) === JSON.stringify(b.streamers);
    },
  );

  const streams = useMemo(() => {
    return {
      videoStreams: Object.values(streamers)
        .map(p => {
          if (p.media?.video?.active) {
            return p.media?.video?.track;
          } else {
            return undefined;
          }
        })
        .filter(s => !!s) as any,
      audioStreams: Object.values(streamers)
        .map(p => p.media?.audio?.track)
        .filter(s => !!s) as any,
    };
  }, [streamers]);

  return streams;
  */
  const [videoStreams, audioStreams] = useStoreShallow(state => [
    state.videoTracks,
    state.audioTracks,
  ]);

  return {videoStreams, audioStreams};
};
