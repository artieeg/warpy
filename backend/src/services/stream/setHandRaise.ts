import { ParticipantDAL } from "@backend/dal";
import { BroadcastService } from "..";

export const setHandRaise = async (
  user: string,
  flag: boolean
): Promise<void> => {
  const participant = await ParticipantDAL.setRaiseHand(user, flag);
  BroadcastService.broadcastRaiseHand(participant);
};
