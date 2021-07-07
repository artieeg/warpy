import { IParticipant, IStream } from "@app/models";
import { ParticipantService, RoleService } from ".";

/*
 * Create a new conversation for a new stream
 */
export const handleNewConversation = async (stream: IStream) => {
  const { id, owner } = stream;

  await Promise.all([
    ParticipantService.addParticipant(owner, id),
    RoleService.setRole(owner, "streamer"),
  ]);
};

/*
 * Clears up participants and track ids after the end of a stream
 */
export const handleConversationEnd = async (streamId: string) => {};

/*
 * Removes user from participants list & removes their track ids
 */
export const handleParticipantLeave = async (user: string) => {};

export const handleParticipantJoin = async (participant: IParticipant) => {};
