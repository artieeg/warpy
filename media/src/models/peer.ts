import { Consumer } from "mediasoup/lib/Consumer";
import { Producer } from "mediasoup/lib/Producer";
import { Transport } from "mediasoup/lib/Transport";
import { MediaKind } from "mediasoup/lib/types";

export interface IPeer {
  sendTransport: {
    video: Transport | null;
    audio: Transport | null;
  };
  recvTransport: Transport | null;
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
