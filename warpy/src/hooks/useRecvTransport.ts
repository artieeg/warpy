import {createTransport, device, initDevice} from '@app/services';
import {Device} from 'mediasoup-client';
import {Transport} from 'mediasoup-client/lib/Transport';
import {useCallback, useEffect, useState} from 'react';

interface IRecvTransportHookParams {
  stream?: string;
  recvTransportOptions?: any;
  routerRtpCapabilities?: any;
}

export const useRecvTransport = (params: IRecvTransportHookParams) => {
  const {stream, recvTransportOptions, routerRtpCapabilities} = params;

  const [transport, setTransport] = useState<Transport>();

  const createRecvTransport = useCallback(async () => {
    if (!recvTransportOptions || !routerRtpCapabilities || !stream) {
      return;
    }

    await initDevice(routerRtpCapabilities);

    const newTransport = await createTransport({
      roomId: stream,
      device,
      direction: 'recv',
      options: {recvTransportOptions},
    });

    setTransport(newTransport);
  }, [stream, recvTransportOptions, routerRtpCapabilities]);

  useEffect(() => {
    createRecvTransport();
  }, [createRecvTransport]);

  return transport;
};
