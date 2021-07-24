import {
  IAllowSpeakerPayload,
  IParticipant,
  IRequestGetTracks,
  IStream,
} from "@conv/models";
import { INewMediaTrack, MessageHandler } from "@warpy/lib";
import { MediaService, MessageService, ParticipantService } from ".";

/**
 * Create a new conversation for a new stream
 */
export const handleNewConversation: MessageHandler<IStream> = async (
  stream
) => {
  const { id, owner } = stream;

  const participant: IParticipant = {
    stream: id,
    id: owner,
    role: "streamer",
  };

  const recvMediaNode = await MediaService.getConsumerNodeId();
  console.log("recvNodeId");

  if (!recvMediaNode) {
    return; // TODO: error
  }

  const media = await MessageService.createMediaRoom({
    host: owner,
    roomId: id,
  });

  await Promise.all([
    ParticipantService.addParticipant(participant),
    ParticipantService.setCurrentStreamFor(participant),
  ]);

  await MediaService.assignUserToNode(owner, recvMediaNode);

  await MessageService.joinMediaRoom(recvMediaNode, {
    user: owner,
    roomId: id,
  });

  MessageService.sendMessage(owner, {
    event: "created-room",
    data: {
      media,
    },
  });
};

/**
 * Clears up participants and track ids after the end of a stream
 */
export const handleConversationEnd = async (streamId: string) => {
  const participants = await ParticipantService.getStreamParticipants(streamId);
  await ParticipantService.removeAllParticipants(streamId);

  await MessageService.sendMessageBroadcast(participants, {}); //TODO
};

/**
 * Removes user from participants list & removes their track ids
 */
export const handleParticipantLeave = async (user: string) => {
  const stream = await ParticipantService.getCurrentStreamFor(user);

  //If user is not in any stream
  if (!stream) {
    return;
  }

  await ParticipantService.removeParticipant({
    id: user,
    stream,
  });

  const users = await ParticipantService.getStreamParticipants(stream);

  await MessageService.sendMessageBroadcast(users, {}); //TODO
};

export const handleParticipantJoin = async (participant: IParticipant) => {
  const { stream, id } = participant;

  const participants = await ParticipantService.getStreamParticipants(stream);

  const recvNodeId = await MediaService.getConsumerNodeId();

  if (!recvNodeId) {
    return; // TODO ERROR
  }

  await Promise.all([
    ParticipantService.addParticipant(participant),
    ParticipantService.setCurrentStreamFor(participant),
  ]);

  await MessageService.joinMediaRoom(recvNodeId, {
    user: id,
    roomId: stream,
  });

  await MessageService.sendMessageBroadcast(participants, {
    event: "user-join",
    data: {
      stream,
      id,
    },
  });
};

export const handleRaisedHand = async (user: string) => {
  const stream = await ParticipantService.getCurrentStreamFor(user);

  if (!stream) {
    return;
  }

  const participants = await ParticipantService.getStreamParticipants(stream);

  MessageService.sendMessageBroadcast(participants, {
    event: "raise-hand",
    data: {
      user,
      stream,
    },
  });
};

export const handleAllowSpeaker = async (data: IAllowSpeakerPayload) => {
  const { speaker, user } = data;
  const stream = await ParticipantService.getCurrentStreamFor(user);

  if (!stream) {
    return;
  }

  const media = await MessageService.connectSpeakerMedia({
    speaker,
    roomId: stream,
  });

  await ParticipantService.setParticipantRole(stream, speaker, "speaker");

  const participants = await ParticipantService.getStreamParticipants(stream);
  const participantsToBroadcast = participants.filter((p) => p !== speaker);

  MessageService.sendMessage(speaker, {
    event: "speaking-allowed",
    data: {
      stream,
      media,
    },
  });

  MessageService.sendMessageBroadcast(participantsToBroadcast, {
    event: "allow-speaker",
    data: {
      speaker,
      stream,
    },
  });
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

  //TODO: check if user is in the room

  const { consumerParams } = await MessageService.getRecvTracks({
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
