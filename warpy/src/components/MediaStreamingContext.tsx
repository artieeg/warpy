import {Device} from 'mediasoup-client';
import React, {createContext, useContext, useMemo, useState} from 'react';
import {MediaClient} from '@warpykit-sdk/client';
import {useAPIStore} from '@app/stores/useAPIStore';

export const MediaStreamingContext = createContext<any>({});

export const useMediaStreamingContext = () => {
  return useContext(MediaStreamingContext);
};

let recvDevice = new Device({handlerName: 'ReactNative'});
let sendDevice = new Device({handlerName: 'ReactNative'});

export const MediaStreamingProvider = ({children}: any) => {
  const {api} = useAPIStore();
  const [permissionsToken, setPermissionsToken] = useState<string | null>(null);

  const media = useMemo(
    () =>
      MediaClient({
        recvDevice,
        sendDevice,
        api,
        permissionsToken,
      }),
    [api, permissionsToken],
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
