import { ParticipantDAL } from "@backend/dal";
import { BroadcastService } from "..";

export const setHandRaise = async (user: string, flag: boolean) => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);
  const participant = await ParticipantDAL.getById(user);

  if (!stream || !participant) {
    throw new Error();
  }

  await Promise.all([
    ParticipantDAL.setRaiseHand(user, flag),
    BroadcastService.broadcastRaiseHand(participant),
  ]);
};
