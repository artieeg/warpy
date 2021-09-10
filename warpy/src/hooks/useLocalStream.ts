import {MediaKind} from 'mediasoup-client/lib/RtpParameters';
import {useState, useCallback, useEffect, useMemo} from 'react';
import {
  mediaDevices,
  MediaStream,
  MediaTrackConstraints,
} from 'react-native-webrtc';

export const useLocalStream = (kind: MediaKind) => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const getMediaSource = useCallback(async () => {
    const videoContstraints: MediaTrackConstraints = {
      facingMode: 'user',
      mandatory: {
        minWidth: 720,
        minHeight: 1080,
        minFrameRate: 30,
      },
      optional: [],
    };

    //Why in the world getUserMedia returns boolean | MediaStream type??
    const mediaStream = await mediaDevices.getUserMedia({
      audio: {
        sampleRate: 48000,
      } as any,
      video: kind === 'video' ? videoContstraints : false,
    });

    //F
    if (!mediaStream || mediaStream === true) {
      return;
    }

    setLocalStream(mediaStream);
  }, [kind]);

  useEffect(() => {
    getMediaSource();
  }, [getMediaSource]);

  return localStream;
};

export const useLocalVideoStream = () => {
  const stream = useLocalStream('video');

  return {stream};
};

export const useLocalAudioStream = () => {
  const stream = useLocalStream('video');
  const [muted, setMuted] = useState(false);

  const toggle = useCallback(() => {
    stream?.getAudioTracks().forEach(audio => (audio.enabled = !muted));
    setMuted(prev => !prev);
  }, [stream, muted]);

  return {stream, toggle, muted};
};
