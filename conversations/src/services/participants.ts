import { IParticipant } from "@app/models";

export const addParticipant = (participant: IParticipant) => {};
export const removeParticipant = (participant: IParticipant) => {};
export const removeAllParticipants = (streamId: string) => {};
export const getCurrentStreamFor = async (
  user: string
): Promise<string | null> => {
  return null;
};
