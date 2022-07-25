import { RequestPostMediaTrack, TransportOptions } from "./requests";

export const createRtpCapabilitiesFixture = (params: any): any => {
  return {
    codecs: [],
    headerExtensions: [],
    ...params,
  };
};

export const createTransportFixture = (
  params: Partial<TransportOptions>
): TransportOptions => {
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
  params?: Partial<RequestPostMediaTrack>
): RequestPostMediaTrack => {
  return {
    user: "test user id",
    direction: "send",
    roomId: "test room id",
    kind: "audio",
    rtpParameters: {} as any,
    rtpCapabilities: createRtpCapabilitiesFixture({}),
    transportId: "test transport id",
    appData: {},
    ...params,
    mediaPermissionsToken: "test",
  };
};
