//Next.js won't compile react-native-webrtc, because it
//uses typescript in some .js files, so lowkey DI here we go

import { Stream } from "@warpy/lib";

type OpenStreamFn = (stream: Stream) => any;
type SaveReactionFn = (code: string) => any;

export const container = {
  mediaDevices: null as any,
  openStream: null as OpenStreamFn | null,
  saveReaction: null as SaveReactionFn | null,
};
