import { RtpCapabilities, WebRtcTransportOptions } from "mediasoup/lib/types";
import { INewMediaTrack, ITransportOptions } from "./events";

export const createRtpCapabilitiesFixture = (
  params: Partial<RtpCapabilities>
): RtpCapabilities => {
  return {
    codecs: [],
    headerExtensions: [],
    ...params,
  };
};

export const createTransportFixture = (
  params: Partial<ITransportOptions>
): ITransportOptions => {
  return {
    id: "test",
    iceParameters: { usernameFragment: "test", password: "test" },
    dtlsParameters: { fingerprints: [] },
    iceCandidates: [],
    ...params,
  };
};

export const createNewMediaRoomDataFixture = () => {
  return {
    routerRtpCapabilities: createRtpCapabilitiesFixture({}),
    recvTransportOptions: createTransportFixture({}),
    sendTransportOptions: createTransportFixture({}),
  };
};

export const createNewTrackFixture = (
  params?: Partial<INewMediaTrack>
): INewMediaTrack => {
  return {
    user: "test user id",
    direction: "send",
    roomId: "test room id",
    kind: "audio",
    rtpParameters: {} as any,
    rtpCapabilities: createRtpCapabilitiesFixture({}),
    transportId: "test transport id",
    appData: {},
    paused: false,
    ...params,
  };
};
