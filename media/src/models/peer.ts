import {
  MediaKind,
  PlainTransport,
  Transport,
  Producer,
  Consumer,
} from "mediasoup/lib/types";

export interface IPeer {
  sendTransport: {
    video: Transport | null;
    audio: Transport | null;
  };
  recvTransport: Transport | null;
  plainTransport: PlainTransport | null;
  producer: {
    audio: Producer | null;
    video: Producer | null;
  };
  consumers: Consumer[];
}

export class Peer implements IPeer {
  sendTransport: {
    video: Transport | null;
    audio: Transport | null;
  };
  plainTransport: PlainTransport | null;
  recvTransport: Transport | null;
  producer: {
    audio: Producer | null;
    video: Producer | null;
  };
  consumers: Consumer[];

  constructor(data: Partial<IPeer>) {
    this.sendTransport = data.sendTransport || {
      video: null,
      audio: null,
    };
    this.plainTransport = data.plainTransport || null;
    this.recvTransport = data.recvTransport || null;
    this.producer = data.producer || {
      video: null,
      audio: null,
    };
    this.consumers = data.consumers || [];
  }

  getSendTransport(kind: MediaKind) {
    return this.sendTransport[kind];
  }
}
