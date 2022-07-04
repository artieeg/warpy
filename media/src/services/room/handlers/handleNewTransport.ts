import { createNewPeer } from "@media/models";
import { SFUService } from "@media/services";
import { getOptionsFromTransport } from "@media/utils";
import {
  MessageHandler,
  ICreateTransport,
  INewTransportResponse,
} from "@warpy/lib";
import { WebRtcTransport } from "mediasoup/node/lib/types";
import { rooms } from "../rooms";

export const handleNewTransport: MessageHandler<
  ICreateTransport,
  INewTransportResponse
> = async (data, respond) => {
  const { roomId, speaker } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  let sendTransport: WebRtcTransport;
  let peer = room.peers[speaker];

  if (!peer) {
    sendTransport = await SFUService.createTransport(
      "send",
      room.router,
      speaker
    );

    peer = room.peers[speaker] = createNewPeer({
      sendTransport,
      router: room.router,
    });
  } else if (peer.sendTransport) {
    sendTransport = peer.sendTransport;
  } else {
    throw new Error(`peer ${speaker} exists but doesnt have a send transport`);
  }

  respond!({
    routerRtpCapabilities: room.router.rtpCapabilities,
    sendTransportOptions: getOptionsFromTransport(sendTransport),
  });
};
