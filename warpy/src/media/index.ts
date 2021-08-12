import {createTransportFactory} from './createTransport';
import {sendMediaStreamFactory} from './sendMediaStream';
import {consumeRemoteStream} from './consumeRemoteStream';
import {MediaAPIFactory} from './types';
import {consumeRemoteStreamsFactory} from './consumeRemoteStreams';

export const MediaAPI: MediaAPIFactory = params => {
  const {recvDevice, sendDevice, api, permissionsToken} = params;

  const createTransport = createTransportFactory(api, permissionsToken);
  const sendMediaStream = sendMediaStreamFactory(sendDevice, createTransport);
  const consumeRemoteStreams = consumeRemoteStreamsFactory(
    api,
    recvDevice,
    permissionsToken,
  );

  return {
    sendMediaStream,
    consumeRemoteStream,
    consumeRemoteStreams,
    createTransport,
  };
};
