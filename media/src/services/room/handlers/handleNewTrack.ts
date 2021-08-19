import { SFUService, MessageService } from "@media/services";
import { verifyMediaPermissions } from "@media/utils";
import { MessageHandler, INewMediaTrack } from "@warpy/lib";
import { Producer } from "mediasoup/lib/types";
import { rooms } from "../rooms";

export const handleNewTrack: MessageHandler<INewMediaTrack> = async (data) => {
  const {
    roomId,
    user,
    direction,
    kind,
    rtpParameters,
    rtpCapabilities,
    appData,
    transportId,
    mediaPermissionsToken,
  } = data;

  verifyMediaPermissions(mediaPermissionsToken, {
    audio: kind === "audio",
    video: kind === "video",
  });

  const room = rooms[roomId];
  if (!room) {
    return; //TODO: Send error
  }

  const { peers } = room;

  const peer = peers[user];
  const transport = peer.getSendTransport(kind);

  if (!transport) {
    return; //TODO: Send error
  }

  //const producer = peer.producer;
  //TODO: Close previous producer if there's one

  let resultId = null;

  let newProducer: Producer;
  try {
    console.log("trying to produce", kind);
    newProducer = await transport.produce({
      kind,
      rtpParameters,
      appData: { ...appData, user, transportId },
    });
    console.log("producing", kind);

    if (kind === "audio") {
      await room.audioLevelObserver.addProducer({
        producerId: newProducer.id,
      });
    }

    const pipeConsumers = await SFUService.createPipeConsumers(newProducer.id);

    console.log("created pipe consumers");

    for (const [node, pipeConsumer] of Object.entries(pipeConsumers)) {
      console.log("sending new producer of", pipeConsumer.kind, "to", node);
      MessageService.sendNewProducer(node, {
        userId: user,
        roomId,
        id: pipeConsumer.id,
        kind: pipeConsumer.kind,
        rtpParameters: pipeConsumer.rtpParameters,
        rtpCapabilities: rtpCapabilities,
        appData: pipeConsumer.appData,
      });
    }
  } catch (e) {
    console.error("error:", e);
    console.error("error:", e.message);
    return;
  }

  peer.producer[kind] = newProducer;
  resultId = newProducer.id;

  MessageService.sendMessageToUser(user, {
    event: `@media/${direction}-track-created`,
    data: {
      id: resultId,
    },
  });
};
