//Next.js won't compile react-native-webrtc, because it
//uses typescript in .js file, so lowkey DI here we go
export const container = {
  mediaDevices: null as any,
};
