import {useStoreShallow} from '@app/store';
import {MediaStream} from 'react-native-webrtc';

export const useRemoteStreams = () => {
  const [videoStreams, audioStreams] = useStoreShallow(state => [
    state.videoTracks,
    state.audioTracks,
  ]);

  return {videoStreams, audioStreams};
};
