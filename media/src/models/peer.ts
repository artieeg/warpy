import { SFUService } from "@media/services";
import {
  PlainTransport,
  Transport,
  Producer,
  Consumer,
  Router,
} from "mediasoup/lib/types";

export interface IPeer {
  router: Router | null;
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  plainTransport: PlainTransport | null;
  producer: {
    audio: Record<string, Producer>;
    video: Record<string, Producer>;
  };
  consumers: Consumer[];
}

export const createNewPeer = (data: Partial<IPeer>): IPeer => ({
  router: data.router || SFUService.getWorker().router,
  sendTransport: null,
  recvTransport: null,
  plainTransport: null,
  consumers: [],
  ...data,
  producer: {
    audio: {},
    video: {},
    ...data.producer,
  },
});

export const closePeerProducers = (
  peer: IPeer,
  {
    audio,
    video,
  }: {
    audio?: boolean;
    video?: boolean;
  }
) => {
  if (audio) {
    Object.values(peer.producer.audio).forEach((producer) => producer.close());
  }

  if (video) {
    Object.values(peer.producer.video).forEach((producer) => producer.close());
  }
};
