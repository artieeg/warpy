import { Peer } from "@media/models";
import { SFUService, MessageService } from "@media/services";
import { MessageHandler, INewProducer } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleNewProducer: MessageHandler<INewProducer> = async (data) => {
  const { userId, roomId, rtpCapabilities, kind } = data;

  const pipeProducer = await SFUService.pipeToIngress.produce({
    id: data.id,
    kind: data.kind,
    rtpParameters: data.rtpParameters,
    appData: data.appData,
  });

  let room = rooms[roomId];

  if (!room) {
    room = {
      router: SFUService.getPipeRouter(),
      peers: {},
      audioLevelObserver: SFUService.getAudioLevelObserver(),
    };
    rooms[roomId] = room;
  }

  const { peers } = room;

  if (!peers[userId]) {
    const recvTransport = await SFUService.createTransport(
      "recv",
      SFUService.getPipeRouter(),
      userId
    );

    peers[userId] = new Peer({
      recvTransport,
      producer: {
        audio: kind === "audio" ? pipeProducer : null,
        video: kind === "video" ? pipeProducer : null,
      },
    });
  } else {
    peers[userId].producer[kind] = pipeProducer;
  }

  for (const peerId in peers) {
    if (peerId === userId) {
      continue;
    }

    const peerRecvTransport = peers[peerId].recvTransport;

    if (!peerRecvTransport) {
      continue;
    }

    try {
      const { consumerParameters } = await SFUService.createConsumer(
        room.router,
        pipeProducer,
        rtpCapabilities,
        peerRecvTransport,
        userId,
        peers[peerId]
      );

      MessageService.sendMessageToUser(peerId, {
        event: "@media/new-track",
        data: {
          user: userId,
          consumerParameters,
          roomId,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
