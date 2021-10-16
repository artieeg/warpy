import { createNewPeer } from "@media/models";
import { SFUService } from "@media/services";
import { getOptionsFromTransport } from "@media/utils";
import {
  MessageHandler,
  ICreateTransport,
  INewTransportResponse,
} from "@warpy/lib";
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

  const sendTransport = await SFUService.createTransport(
    "send",
    room.router,
    speaker
  );

  const peer = createNewPeer({
    sendTransport,
  });

  //Close video producer if it exists
  peer.producer.video?.close();

  room.peers[speaker] = peer;

  respond!({
    routerRtpCapabilities: room.router.rtpCapabilities,
    sendTransportOptions: getOptionsFromTransport(sendTransport),
  });
};
