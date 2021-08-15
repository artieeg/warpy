import {Device} from 'mediasoup-client';
import React, {createContext, useContext, useMemo, useState} from 'react';
import {MediaClient} from '@warpykit-sdk/client';
import {useWebSocketContext} from './WebSocketContext';

export const MediaStreamingContext = createContext<any>({});

export const useMediaStreamingContext = () => {
  return useContext(MediaStreamingContext);
};

let recvDevice = new Device({handlerName: 'ReactNative'});
let sendDevice = new Device({handlerName: 'ReactNative'});

export const MediaStreamingProvider = ({children}: any) => {
  const ws = useWebSocketContext();
  const [permissionsToken, setPermissionsToken] = useState<string | null>(null);

  const media = useMemo(
    () =>
      MediaClient({
        recvDevice,
        sendDevice,
        api: ws,
        permissionsToken,
      }),
    [ws, permissionsToken],
  );

  const initSendDevice = async (routerRtpCapabilities: any) => {
    if (!sendDevice) {
      sendDevice = new Device({handlerName: 'ReactNative'});
    }

    if (!sendDevice.loaded) {
      await sendDevice.load({routerRtpCapabilities});
    }
  };

  const initRecvDevice = async (routerRtpCapabilities: any) => {
    if (!recvDevice) {
      recvDevice = new Device({handlerName: 'ReactNative'});
    }

    if (!recvDevice.loaded) {
      await recvDevice.load({routerRtpCapabilities});
    }
  };

  console.log('permissions tkoen', permissionsToken);

  return (
    <MediaStreamingContext.Provider
      value={{
        ...media,
        recvDevice,
        sendDevice,
        initRecvDevice,
        initSendDevice,
        permissionsToken,
        setPermissionsToken: (token: string) => setPermissionsToken(token),
      }}>
      {children}
    </MediaStreamingContext.Provider>
  );
};
