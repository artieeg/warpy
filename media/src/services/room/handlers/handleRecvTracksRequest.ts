import { MessageService, SFUService } from "@media/services";
import {
  MessageHandler,
  RequestRecvTracks,
  IRecvTracksResponse,
} from "@warpy/lib";
import { rooms } from "../rooms";

export const handleRecvTracksRequest: MessageHandler<
  RequestRecvTracks,
  IRecvTracksResponse
> = async (data, respond) => {
  const { stream, user, rtpCapabilities } = data;

  const room = rooms[stream];

  if (!room) {
    return;
  }

  const { peers } = room;

  const { router } = SFUService.getWorker();

  const peer = peers[user];

  if (!peer) {
    return;
  }

  const transport = peer.recvTransport;

  if (!transport) {
    return;
  }

  peer.rtpCapabilities = rtpCapabilities;

  const consumerParams: any[] = [];

  await MessageService.requestMediaTracks(stream);

  for (const peerId of Object.keys(peers)) {
    const peer = peers[peerId];

    if (!peer || peerId == user || !peer.producer) {
      continue;
    }

    try {
      const [audioProducer, videoProducer] = [
        peer.producer.audio[router.id],
        peer.producer.video[router.id],
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
