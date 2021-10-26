import {Device} from 'mediasoup-client';

export interface IDeviceSlice {
  recvDevice: Device;
  sendDevice: Device;
}

export const createDeviceSlice = (): IDeviceSlice => ({
  recvDevice: new Device({handlerName: 'ReactNative'}),
  sendDevice: new Device({handlerName: 'ReactNative'}),
});
