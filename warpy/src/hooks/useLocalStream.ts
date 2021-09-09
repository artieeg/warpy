import {MediaKind} from 'mediasoup-client/lib/RtpParameters';
import {useState, useCallback, useEffect, useMemo} from 'react';
import {
  mediaDevices,
  MediaStream,
  MediaTrackConstraints,
} from 'react-native-webrtc';

const getMediaSource = async (kind: MediaKind): Promise<MediaStream | null> => {
  const videoContstraints: MediaTrackConstraints = {
    facingMode: 'user',
    mandatory: {
      minWidth: 720,
      minHeight: 1080,
      minFrameRate: 30,
    },
    optional: [],
  };

  //mediaStream is of type boolean | MediaStream somehow??
  const mediaStream = await mediaDevices.getUserMedia({
    audio: {
      sampleRate: 48000,
    } as any,
    video: kind === 'video' ? videoContstraints : false,
  });

  //F
  if (!mediaStream || mediaStream === true) {
    return null;
  }

  return mediaStream;
};

export const useLocalVideoStream = () => {
  const [stream, setStream] = useState<MediaStream | null>();

  useEffect(() => {
    getMediaSource('video').then(setStream);
  });

  return {stream};
};

export const useLocalAudioStream = () => {
  const [stream, setStream] = useState<MediaStream | null>();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    getMediaSource('video').then(setStream);
  });

  const toggle = useCallback(() => {
    stream?.getAudioTracks().forEach(audio => (audio.enabled = !muted));
    setMuted(prev => !prev);
  }, [stream, muted]);

  return {stream, toggle, muted};
};
