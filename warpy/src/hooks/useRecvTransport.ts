import {useStore} from '@app/store';
import {Transport} from 'mediasoup-client/lib/Transport';
import {useCallback, useEffect, useState} from 'react';
import shallow from 'zustand/shallow';

export const useRecvTransport = () => {
  const [
    transport,
    stream,
    media,
    recvDevice,
    mediaPermissionToken,
    recvMediaParams,
  ] = useStore(
    state => [
      state.recvTransport,
      state.stream,
      state.mediaClient,
      state.recvDevice,
      state.mediaPermissionsToken,
      state.recvMediaParams,
    ],
    shallow,
  );

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

    const newTransport = await media.createTransport({
      roomId: stream,
      device: recvDevice,
      direction: 'recv',
      options: {recvTransportOptions},
      isProducer: false,
    });

    useStore.setState({recvTransport: newTransport});
  }, [stream, recvMediaParams, media, mediaPermissionToken]);

  useEffect(() => {
    if (!transport) {
      createRecvTransport();
    }
  }, [createRecvTransport]);

  return transport;
};
