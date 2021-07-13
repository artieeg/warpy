import {Device} from 'mediasoup-client';

export const getDevice = () => {
  return new Device({handlerName: 'ReactNative'});
};
