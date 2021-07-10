import {
  IAllowSpeakerPayload,
  INewTrackPayload,
  IParticipant,
  IStream,
} from "@app/models";
import { MessageService, ParticipantService } from ".";

/**
 * Create a new conversation for a new stream
 */
export const handleNewConversation = async (stream: IStream) => {
  const { id, owner } = stream;

  console.log("new stream event", stream);

  const participant: IParticipant = {
    stream: id,
    id: owner,
    role: "streamer",
  };

  await Promise.all([
    ParticipantService.addParticipant(participant),
    ParticipantService.setCurrentStreamFor(participant),
  ]);
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

  console.log("broadcasting to", participants);

  await Promise.all([
    ParticipantService.addParticipant(participant),
    ParticipantService.setCurrentStreamFor(participant),
  ]);

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

  const participants = await ParticipantService.getStreamParticipants(stream);
  const participantsToBroadcast = participants.filter((p) => p !== speaker);

  console.log(`sending speakign allowed event to ${speaker}`);
  MessageService.sendMessage(speaker, {
    event: "speaking-allowed",
    data: {
      stream,
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

export const handleNewTrack = async (data: INewTrackPayload) => {
  const { track, user } = data;

  const stream = await ParticipantService.getCurrentStreamFor(user);

  if (!stream) {
    return;
  }

  const participants = await ParticipantService.getStreamParticipants(stream);
  const role = await ParticipantService.getRoleFor(user, stream);

  if (role === "viewer") {
    return;
  }

  const participantsToBroadcast = participants.filter((p) => p !== user);

  MessageService.sendMessageBroadcast(participantsToBroadcast, {
    event: "track-new",
    data: {
      user,
      stream,
      track,
    },
  });
};
