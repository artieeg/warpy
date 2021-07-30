import {
  IBaseParticipant,
  IRoom,
  IAllowSpeakerPayload,
  IRequestGetTracks,
  IParticipant,
  Participant,
} from "@app/models";
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

export const init = () => {
  MessageService.on("user-disconnected", (data: any) => {
    const { user } = data;

    handleParticipantLeave(user);
  });
};

/**
 * Create a new conversation for a new stream
 */
export const handleNewConversation: MessageHandler<IRoom> = async (stream) => {
  const { id, owner } = stream;

  const participant: IBaseParticipant = {
    stream: id,
    id: owner,
    role: "streamer",
  };

  const hostData = await UserService.getUserById(owner);

  const recvMediaNode = await MediaService.getConsumerNodeId();

  if (!recvMediaNode || !hostData) {
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
      speakers: [Participant.fromUser(hostData, "streamer", id)],
      count: 1,
    },
  });
};

/**
 * Clears up participants at the end of a stream
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

  await ParticipantService.removeParticipant(user, stream);

  const users = await ParticipantService.getStreamParticipants(stream);

  await MessageService.sendMessageBroadcast(users, {
    event: "user-left",
    body: {
      user,
      stream,
    },
  });
};

export const handleParticipantJoin = async (participant: IBaseParticipant) => {
  const { stream, id } = participant;

  const [participants, recvNodeId, userInfo] = await Promise.all([
    ParticipantService.getStreamParticipants(stream),
    MediaService.getConsumerNodeId(),
    UserService.getUserById(id),
  ]);

  if (!userInfo) {
    return;
  }

  if (!recvNodeId) {
    return; // TODO ERROR
  }

  await Promise.all([
    MediaService.assignUserToNode(id, recvNodeId),
    ParticipantService.addParticipant(participant),
    ParticipantService.setCurrentStreamFor(participant),
  ]);

  await MessageService.joinMediaRoom(recvNodeId, {
    user: id,
    roomId: stream,
  });

  await MessageService.sendMessageBroadcast(participants, {
    event: "new-viewer",
    data: {
      stream,
      viewer: Participant.fromJSON(userInfo),
    },
  });

  const [speakersWithRoles, userWithRaisedHandIds] = await Promise.all([
    ParticipantService.getSpeakersWithRoles(stream),
    ParticipantService.getUsersWithRaisedHands(stream),
  ]);
  const speakerIds = Object.keys(speakersWithRoles);

  const [
    speakerUserInfo,
    usersWithRaisedHand,
    participantCount,
  ] = await Promise.all([
    UserService.getUsersByIds(speakerIds),
    UserService.getUsersByIds(userWithRaisedHandIds),
    ParticipantService.getParticipantsCount(stream),
  ]);

  MessageService.sendMessage(id, {
    event: "room-info",
    data: {
      speakers: speakerUserInfo.map((speaker) =>
        Participant.fromUser(speaker, speakersWithRoles[speaker.id], stream)
      ),
      raisedHands: usersWithRaisedHand.map((userWithRaisedHand) =>
        Participant.fromUser(userWithRaisedHand, "viewer", stream)
      ),
      count: participantCount,
    },
  });
};

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
