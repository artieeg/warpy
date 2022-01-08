import { config } from "@media/config";
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
  const transport = peer.sendTransport;

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
      appData: { ...appData, user, transportId, stream: roomId },
    });
    console.log("producing", kind);

    if (kind === "audio") {
      await room.audioLevelObserver.addProducer({
        producerId: newProducer.id,
      });
      console.log("added producer to the audio observer");
    }

    if (kind === "video") {
      const codec = room.router.rtpCapabilities.codecs?.find(
        (c) => c.mimeType.toLowerCase() === "video/vp8"
      );

      if (!codec) {
        throw new Error("Can't find codec for video");
      }

      const recorderRtpCapabilities = {
        codecs: [codec],
        rtcpFeedback: [],
      };

      if (!peer.plainTransport) {
        peer.plainTransport = await SFUService.createPlainTransport(
          room.router
        );

        const remoteRtpPort = SFUService.getPortForRemoteRTP();
        await peer.plainTransport.connect({
          ip: config.mediasoup.plainRtpTransport.listenIp.ip,
          port: remoteRtpPort,
        });

        peer.plainTransport.appData.remoteRtpPort = remoteRtpPort;
      }

      const rtpConsumer = await peer.plainTransport.consume({
        producerId: newProducer.id,
        rtpCapabilities: recorderRtpCapabilities,
        paused: true,
      });

      console.log({ rtpConsumer });

      /*
      if (!rtpConsumer) {
        throw new Error("Failed to create rtp consumer");
      }
      */

      if (rtpConsumer) {
        peer.consumers.push(rtpConsumer);

        console.log("requesting recording for", user, "in", roomId);

        MessageService.sendRecordRequest({
          stream: roomId,
          user,
          remoteRtpPort: peer.plainTransport?.appData.remoteRtpPort,
          //remoteRtcpPort,
          localRtcpPort: peer.plainTransport?.rtcpTuple
            ? peer.plainTransport.rtcpTuple?.localPort
            : undefined,
          rtpCapabilities: recorderRtpCapabilities,
          rtpParameters: rtpConsumer.rtpParameters,
        });

        setTimeout(() => {
          rtpConsumer.resume();
        }, 1000);
      }
    }

    peer.rtpCapabilities = rtpCapabilities;

    room.forwardingToNodeIds.forEach(async (node) => {
      const pipeConsumer = await SFUService.createPipeConsumer(
        newProducer.id,
        node
      );

      MessageService.sendNewProducer(node, {
        userId: user,
        roomId,
        id: pipeConsumer.id,
        kind: pipeConsumer.kind,
        rtpParameters: pipeConsumer.rtpParameters,
        rtpCapabilities: rtpCapabilities,
        appData: pipeConsumer.appData,
      });
    });
    /*

    for (const [node, pipeConsumer] of Object.entries(pipeConsumers)) {
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
    */
  } catch (e) {
    console.error("error:", e);
    return;
  }

  peer.producer[kind] = {
    [SFUService.getPipeRouter().id]: newProducer,
  };

  resultId = newProducer.id;

  MessageService.sendMessageToUser(user, {
    event: `@media/${direction}-track-created`,
    data: {
      id: resultId,
    },
  });
};
