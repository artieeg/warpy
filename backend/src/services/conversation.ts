import { IRequestGetTracks } from "@backend/models";
import { IConnectMediaTransport, INewMediaTrack } from "@warpy/lib";
import { MediaService, MessageService, ParticipantService } from ".";

export const handleConnectTransport = async (data: IConnectMediaTransport) => {
  const { user } = data;
  const stream = await ParticipantService.getCurrentStreamFor(user);

  console.log("connecting transport for", user);
  console.log("stream", stream);

  if (!stream) {
    return;
  }

  //const role = await ParticipantService.getRoleFor(user, stream);
  const node = await MediaService.getConsumerNodeFor(user);

  console.log("consumer node", node);
  if (!node) {
    return;
  }

  console.log("transport data", data);
  MessageService.sendConnectTransport(node, data);
};

export const handleNewTrack = async (data: INewMediaTrack) => {
  const { user } = data;

  const stream = await ParticipantService.getCurrentStreamFor(user);

  if (!stream) {
    return;
  }

  const role = await ParticipantService.getRoleFor(user, stream);

  if (role === "viewer") {
    return;
  }

  MessageService.sendNewTrack(data);
};

export const handleRecvTracksRequest = async (data: IRequestGetTracks) => {
  const { user, stream, rtpCapabilities } = data;

  const recvNodeId = await MediaService.getConsumerNodeFor(user);

  if (!recvNodeId) {
    return;
  }

  const { consumerParams } = await MessageService.getRecvTracks(recvNodeId, {
    roomId: stream,
    user,
    rtpCapabilities,
  });

  MessageService.sendMessage(user, {
    event: "recv-tracks-response",
    data: {
      consumerParams,
    },
  });
};
