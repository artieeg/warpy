//import {createTransport, recvDevice, initRecvDevice} from '@app/services';
import {useStore} from '@app/store';
import {Transport} from 'mediasoup-client/lib/Transport';
import {useCallback, useEffect, useState} from 'react';
import shallow from 'zustand/shallow';

export const useRecvTransport = () => {
  const [stream, media, recvDevice, mediaPermissionToken, recvMediaParams] =
    useStore(
      state => [
        state.stream,
        state.mediaClient,
        state.recvDevice,
        state.mediaPermissionsToken,
        state.recvMediaParams,
      ],
      shallow,
    );

  const [transport, setTransport] = useState<Transport>();

  const createRecvTransport = useCallback(async () => {
    if (!recvMediaParams) {
      return;
    }

    const {recvTransportOptions, routerRtpCapabilities} = recvMediaParams;

    if (
      !recvTransportOptions ||
      !routerRtpCapabilities ||
      !stream ||
      !mediaPermissionToken ||
      !media
    ) {
      return;
    }

    //await media.initRecvDevice(routerRtpCapabilities);

    const newTransport = await media.createTransport({
      roomId: stream,
      device: recvDevice,
      direction: 'recv',
      options: {recvTransportOptions},
      isProducer: false,
    });

    setTransport(newTransport);
  }, [stream, recvMediaParams, media, mediaPermissionToken]);

  useEffect(() => {
    createRecvTransport();
  }, [createRecvTransport]);

  return transport;
};
