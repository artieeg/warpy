import {Device} from 'mediasoup-client';
import {GetState, SetState} from 'zustand';
import {IStore} from '../useStore';

export interface IDeviceSlice {
  recvDevice: Device;
  sendDevice: Device;

  initSendDevice: (routerRtpCapabilities: any) => Promise<void>;
  initRecvDevice: (routerRtpCapabilities: any) => Promise<void>;
}

export const createDeviceSlice = (
  _set: SetState<IStore>,
  get: GetState<IStore>,
): IDeviceSlice => ({
  recvDevice: new Device({handlerName: 'ReactNative'}),
  sendDevice: new Device({handlerName: 'ReactNative'}),

  async initSendDevice(routerRtpCapabilities) {
    const {sendDevice} = get();

    if (!sendDevice.loaded) {
      await sendDevice.load({routerRtpCapabilities});
    }
  },

  async initRecvDevice(routerRtpCapabilities) {
    const {recvDevice} = get();

    if (!recvDevice.loaded) {
      await recvDevice.load({routerRtpCapabilities});
    }
  },
});
