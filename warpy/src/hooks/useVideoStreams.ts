import {useMemo} from 'react';
import {useLocalVideoStream, useLocalAudioStream, useRemoteStreams} from '.';
import {useStore} from '@app/store';

export const useVideoStreams = ({
  forceLocalStream,
}: {
  forceLocalStream?: boolean;
}) => {
  const {stream: localVideoStream} = useLocalVideoStream();
  useLocalAudioStream();
  const {videoStreams} = useRemoteStreams();

  const role = useStore.use.role();

  const streams = useMemo(() => {
    if (localVideoStream && (role === 'streamer' || forceLocalStream)) {
      return [localVideoStream, ...videoStreams];
    } else {
      return videoStreams;
    }
  }, [localVideoStream, videoStreams]);

  return streams;
};
