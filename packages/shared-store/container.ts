//Next.js won't compile react-native-webrtc, because it
//uses typescript in some .js files, so lowkey DI here we go

type OpenStreamFn = (id: string) => any;

export const container = {
  mediaDevices: null as any,
  openStream: null as OpenStreamFn | null,
};
