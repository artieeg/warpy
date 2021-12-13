import { SFUService } from "@media/services";
import {
  MessageHandler,
  IRecvTracksRequest,
  IRecvTracksResponse,
} from "@warpy/lib";
import { rooms } from "../rooms";

export const handleRecvTracksRequest: MessageHandler<
  IRecvTracksRequest,
  IRecvTracksResponse
> = async (data, respond) => {
  const { stream, user, rtpCapabilities } = data;

  const room = rooms[stream];

  if (!room) {
    return;
  }

  const { peers } = room;

  const router = SFUService.getRouter();
  console.log("using router", router.id);

  const peer = peers[user];

  if (!peer) {
    return;
  }

  const transport = peer.recvTransport;

  if (!transport) {
    return;
  }

  const consumerParams = [];

  for (const peerId of Object.keys(peers)) {
    const peer = peers[peerId];

    if (!peer || peerId == user || !peer.producer) {
      continue;
    }

    try {
      //const { producer } = peer;
      const [audioProducer, videoProducer] = [
        peer.producer.audio,
        peer.producer.video,
      ];

      if (videoProducer) {
        consumerParams.push(
          await SFUService.createConsumer(
            router,
            videoProducer,
            rtpCapabilities,
            transport,
            user,
            peers[peerId],
            peerId
          )
        );
      }

      if (audioProducer) {
        consumerParams.push(
          await SFUService.createConsumer(
            router,
            audioProducer,
            rtpCapabilities,
            transport,
            user,
            peers[peerId],
            peerId
          )
        );
      }
    } catch (e) {
      continue;
    }
  }

  respond!({
    consumerParams,
  });
};
