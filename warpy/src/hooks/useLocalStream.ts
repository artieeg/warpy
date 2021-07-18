import {MediaKind} from 'mediasoup-client/lib/RtpParameters';
import {useState, useCallback, useEffect} from 'react';
import {
  mediaDevices,
  MediaStream,
  MediaTrackConstraints,
} from 'react-native-webrtc';

export const useLocalStream = (kind: MediaKind) => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const getVideoSource = useCallback(async () => {
    const videoContstraints: MediaTrackConstraints = {
      facingMode: 'user',
      mandatory: {
        minWidth: 640,
        minHeight: 480,
        minFrameRate: 24,
      },
      optional: [],
    };

    //Why in the world getUserMedia returns boolean | MediaStream type??
    const mediaStream = await mediaDevices.getUserMedia({
      audio: true,
      video: kind === 'video' ? videoContstraints : false,
    });

    //F
    if (!mediaStream || mediaStream === true) {
      return;
    }

    setLocalStream(mediaStream);
  }, [kind]);

  useEffect(() => {
    getVideoSource();
  }, [getVideoSource]);

  return localStream;
};
