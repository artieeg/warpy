import {Device} from 'mediasoup-client';
import {CreateTransport, SendMediaStream} from './types';

export const sendMediaStreamFactory =
  (sendDevice: Device, createTransport: CreateTransport): SendMediaStream =>
  async (media, stream, options, kind) => {
    const sendTransport = await createTransport({
      roomId: stream,
      device: sendDevice,
      direction: 'send',
      options: {
        sendTransportOptions: options.sendTransportOptions[kind],
      },
      mediaKind: kind,
      isProducer: true,
    });

    const track =
      kind === 'video' ? media.getVideoTracks()[0] : media.getAudioTracks()[0];

    await sendTransport.produce({
      track,
      appData: {kind},
    });
  };
