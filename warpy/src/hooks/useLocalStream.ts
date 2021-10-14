import {useStore} from '@app/store';
import {MediaKind} from 'mediasoup-client/lib/RtpParameters';
import {useState, useCallback, useEffect} from 'react';
import {mediaDevices, MediaTrackConstraints} from 'react-native-webrtc';

export const useLocalStream = (kind: MediaKind) => {
  const localStream = useStore(state => state[kind]);

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

    //getUserMedia returns boolean | MediaStream type?? sadge
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

    //useStore.setState({[kind]: mediaStream});
    if (kind === 'video') {
      useStore.setState({
        video: {
          stream: mediaStream,
          track: mediaStream.getVideoTracks()[0],
        },
      });
    } else {
      useStore.setState({
        audio: {
          stream: mediaStream,
          track: mediaStream.getAudioTracks()[0],
        },
      });
    }
  }, [kind]);

  useEffect(() => {
    if (!localStream) {
      getMediaSource();
    }
  }, [getMediaSource]);

  return localStream?.stream;
};

export const useLocalVideoStream = () => {
  const stream = useLocalStream('video');

  const switchCamera = useCallback(() => {
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      (videoTrack as any)._switchCamera();
    }
  }, [stream]);

  const [muted, setMuted] = useState(false);

  const toggle = useCallback(() => {
    stream?.getAudioTracks().forEach(audio => (audio.enabled = !muted));
    setMuted(prev => !prev);
  }, [stream, muted]);

  return {stream, switchCamera, toggle, muted};
};

export const useLocalAudioStream = () => {
  const audioStream = useLocalStream('audio');
  const [muted, setMuted] = useState(false);

  const toggle = useCallback(() => {
    audioStream?.getAudioTracks().forEach(audio => (audio.enabled = !muted));
    setMuted(prev => !prev);
  }, [audioStream, muted]);

  return {stream: audioStream, toggle, muted};
};
