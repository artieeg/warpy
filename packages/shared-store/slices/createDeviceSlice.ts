import { Device, detectDevice } from "mediasoup-client";

export interface IDeviceSlice {
  recvDevice: Device;
  sendDevice: Device;
}

export const createDeviceSlice = (): IDeviceSlice => ({
  recvDevice: new Device({ handlerName: detectDevice() }),
  sendDevice: new Device({ handlerName: detectDevice() }),
});
