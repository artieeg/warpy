import {useMemo} from 'react';
import {useRemoteStreams} from '.';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const useVideoStreams = ({
  forceLocalStream,
}: {
  forceLocalStream?: boolean;
}) => {
  const [videoStopped, localVideoData] = useStore(
    state => [state.videoStopped, state.video],
    shallow,
  );
  const localVideoStream = localVideoData?.stream;

  const {videoStreams} = useRemoteStreams();

  const role = useStore.use.role();

  const streams = useMemo(() => {
    if (
      localVideoStream &&
      (role === 'streamer' || forceLocalStream) &&
      !videoStopped
    ) {
      return [localVideoStream, ...videoStreams];
    } else {
      return videoStreams;
    }
  }, [localVideoStream, videoStreams, videoStopped]);

  return streams;
};
