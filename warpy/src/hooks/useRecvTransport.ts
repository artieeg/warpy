//import {createTransport, recvDevice, initRecvDevice} from '@app/services';
import {useMediaStreamingContext} from '@app/components';
import {Transport} from 'mediasoup-client/lib/Transport';
import {useCallback, useEffect, useState} from 'react';

interface IRecvTransportHookParams {
  stream?: string;
  recvTransportOptions?: any;
  routerRtpCapabilities?: any;
}

export const useRecvTransport = (params: IRecvTransportHookParams) => {
  const {stream, recvTransportOptions, routerRtpCapabilities} = params;

  const media = useMediaStreamingContext();

  const [transport, setTransport] = useState<Transport>();

  const createRecvTransport = useCallback(async () => {
    if (!recvTransportOptions || !routerRtpCapabilities || !stream) {
      return;
    }

    await media.initRecvDevice(routerRtpCapabilities);

    const newTransport = await media.createTransport({
      roomId: stream,
      device: media.recvDevice,
      direction: 'recv',
      options: {recvTransportOptions},
      isProducer: false,
    });

    setTransport(newTransport);
  }, [stream, recvTransportOptions, routerRtpCapabilities, media]);

  useEffect(() => {
    createRecvTransport();
  }, [createRecvTransport]);

  return transport;
};
