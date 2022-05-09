//Next.js won't compile react-native-webrtc, because it
//uses typescript in some .js files, so lowkey DI here we go

import { IStream } from "@warpy/lib";

type OpenStreamFn = (stream: IStream) => any;

export const container = {
  mediaDevices: null as any,
  openStream: null as OpenStreamFn | null,
};
