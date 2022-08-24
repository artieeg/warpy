import {useStoreShallow} from '@app/store';
import {useMemo} from 'react';

export const useRemoteStreams = () => {
  const [audio, video] = useStoreShallow(state => [
    state.audioStreams,
    state.videoStreams,
  ]);

  const videoStreams = useMemo(() => {
    const streams = Object.values(video);

    return streams
      .filter(stream => stream.enabled)
      .map(stream => stream.stream);
  }, [video]);

  const audioStreams = useMemo(() => {
    const streams = Object.values(audio);

    return streams
      .filter(stream => stream.enabled)
      .map(stream => stream.stream);
  }, [audio]);

  return {videoStreams, audioStreams};
};
