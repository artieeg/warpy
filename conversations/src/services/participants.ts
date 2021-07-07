import { IParticipant } from "@app/models";

export const addParticipant = async (user: string, stream: string) => {};
export const removeParticipant = async (participant: IParticipant) => {};
export const removeAllParticipants = async (streamId: string) => {};
export const getCurrentStreamFor = async (
  user: string
): Promise<string | null> => {
  return null;
};
