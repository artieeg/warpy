import { IAllowSpeakerPayload, IRequestGetTracks } from "@backend/models";

import { IBaseParticipant, Participant } from "@warpy/lib";

import {
  IConnectMediaTransport,
  INewMediaTrack,
  MessageHandler,
} from "@warpy/lib";
import {
  MediaService,
  MessageService,
  ParticipantService,
  UserService,
} from ".";

export const handleRaisedHand = async (viewerId: string) => {
  const stream = await ParticipantService.getCurrentStreamFor(viewerId);

  const userData = await UserService.getUserById(viewerId);

  if (!stream || !userData) {
    return;
  }

  const participants = await ParticipantService.getStreamParticipants(stream);

  try {
    await ParticipantService.setRaiseHand(viewerId, stream);
    MessageService.sendMessageBroadcast(participants, {
      event: "raise-hand",
      data: {
        viewer: Participant.fromUser(userData, "viewer", stream),
        stream,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const handleAllowSpeaker = async (data: IAllowSpeakerPayload) => {
  const { speaker, user } = data;
  const [stream, userData] = await Promise.all([
    ParticipantService.getCurrentStreamFor(user),
    UserService.getUserById(speaker),
  ]);

  if (!userData || !stream) {
    return;
  }

  try {
    await ParticipantService.unsetRaiseHand(user, stream);
  } catch (e) {
    console.error(e);
    return;
  }
  const media = await MessageService.connectSpeakerMedia({
    speaker,
    roomId: stream,
  });

  await ParticipantService.setParticipantRole(stream, speaker, "speaker");

  const participants = await ParticipantService.getStreamParticipants(stream);
  //const participantsToBroadcast = participants.filter((p) => p !== speaker);

  const speakerData = Participant.fromUser(userData, "speaker", stream);

  MessageService.sendMessage(speaker, {
    event: "speaking-allowed",
    data: {
      stream,
      media,
    },
  });

  MessageService.sendMessageBroadcast(participants, {
    event: "new-speaker",
    data: {
      speaker: speakerData,
      stream,
    },
  });
};

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
