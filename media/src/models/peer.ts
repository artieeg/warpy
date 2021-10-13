import {
  MediaKind,
  PlainTransport,
  Transport,
  Producer,
  Consumer,
} from "mediasoup/lib/types";

export interface IPeer {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  plainTransport: PlainTransport | null;
  producer: {
    audio: Producer | null;
    video: Producer | null;
  };
  consumers: Consumer[];
}

export const createNewPeer = (data: Partial<IPeer>): IPeer => ({
  sendTransport: null,
  recvTransport: null,
  plainTransport: null,
  consumers: [],
  ...data,
  producer: {
    audio: null,
    video: null,
    ...data.producer,
  },
});
