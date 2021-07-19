import { RtpCapabilities, WebRtcTransportOptions } from "mediasoup/lib/types";
import { ITransportOptions } from "./events";

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
