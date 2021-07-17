import {useState, useCallback, useEffect} from 'react';
import {
  mediaDevices,
  MediaStream,
  MediaTrackConstraints,
} from 'react-native-webrtc';

export const useLocalStream = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const getVideoSource = useCallback(async () => {
    const devices = await mediaDevices.enumerateDevices();

    let videoSourceId = devices.find(
      (device: any) =>
        device.kind === 'videoinput' && device.facing === 'front',
    ).deviceId;

    //Why in the world getUserMedia returns boolean | MediaStream type??
    const mediaStream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'user',
        deviceId: videoSourceId,
        mandatory: {
          minWidth: 640,
          minHeight: 480,
          minFrameRate: 24,
        },
        optional: [],
      } as MediaTrackConstraints,
    });

    //F
    if (!mediaStream || mediaStream === true) {
      return;
    }

    setLocalStream(mediaStream);
  }, []);

  useEffect(() => {
    getVideoSource();
  }, [getVideoSource]);

  return localStream;
};
