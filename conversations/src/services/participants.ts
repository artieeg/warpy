import { IParticipant } from "@app/models";
import { Roles } from "@app/types";

export const init = async () => {};
export const addParticipant = async (participant: IParticipant) => {};
export const setParticipantRole = async (
  stream: string,
  user: string,
  role: Roles
) => {};
export const removeParticipant = async (participant: IParticipant) => {};
export const getStreamParticipants = async (streamId: string) => {
  return [] as string[];
};
export const removeAllParticipants = async (streamId: string) => {};
export const getCurrentStreamFor = async (
  user: string
): Promise<string | null> => {
  return null;
};

export const setCurrentStreamFor = async (participant: IParticipant) => {};
export const getRoleFor = async (
  user: string,
  stream: string
): Promise<Roles> => {
  return "viewer";
};
