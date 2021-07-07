import { IParticipant } from "@app/models";
import { Roles } from "@app/types";

export const addParticipant = async (participant: IParticipant) => {};
export const setParticipantRole = async (
  stream: string,
  user: string,
  role: Roles
) => {};
export const removeParticipant = async (participant: IParticipant) => {};
export const getAllParticipants = async (streamId: string) => {};
export const removeAllParticipants = async (streamId: string) => {};
export const getCurrentStreamFor = async (
  user: string
): Promise<string | null> => {
  return null;
};
