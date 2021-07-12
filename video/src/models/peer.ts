import { Producer } from "mediasoup/lib/Producer";
import { Transport } from "mediasoup/lib/Transport";
import { Consumer } from "nats";

export interface IPeer {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  producer: Producer | null;
  consumers: Consumer[];
}
