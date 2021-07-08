import { IParticipant, IStream } from "@app/models";
import { MessageService, ParticipantService } from ".";

/*
 * Create a new conversation for a new stream
 */
export const handleNewConversation = async (stream: IStream) => {
  const { id, owner } = stream;

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

/*
 * Clears up participants and track ids after the end of a stream
 */
export const handleConversationEnd = async (streamId: string) => {
  const participants = await ParticipantService.getStreamParticipants(streamId);
  await ParticipantService.removeAllParticipants(streamId);

  await MessageService.sendMessageBroadcast(participants, {}); //TODO
};

/*
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
  const { stream } = participant;

  const participants = await ParticipantService.getStreamParticipants(stream);

  await Promise.all([
    ParticipantService.addParticipant(participant),
    ParticipantService.setCurrentStreamFor(participant),
  ]);

  await MessageService.sendMessageBroadcast(participants, {});
};

export const handleRaisedHand = async (user: string) => {};
export const handleAllowSpeaker = async (user: string, speaker: string) => {};
