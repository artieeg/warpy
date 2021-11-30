import {useMemo} from 'react';
import {useRemoteStreams} from '.';
import {useStore} from '@warpy/store';
import shallow from 'zustand/shallow';

export const useVideoStreams = () => {
  const [videoEnabled, localVideoData] = useStore(
    state => [state.videoEnabled, state.video],
    shallow,
  );
  const localVideoStream = localVideoData?.stream;

  const {videoStreams} = useRemoteStreams();

  const streams = useMemo(() => {
    if (localVideoStream && videoEnabled) {
      return [localVideoStream, ...videoStreams];
    } else {
      return videoStreams;
    }
  }, [localVideoStream, videoStreams, videoEnabled]);

  return streams;
};
