import { Participant } from "@warpy/lib";
import { ParticipantService } from "..";
import { User } from "@backend/models";

export const setHandRaise = async (user: string, flag: boolean) => {
  const stream = await ParticipantService.getCurrentStreamFor(user);
  const userData = await User.findOne(user);

  if (!stream || !userData) {
    throw new Error();
  }

  await Promise.all([
    ParticipantService.setRaiseHand(user),
    ParticipantService.broadcastRaiseHand(
      Participant.fromUser(userData, "viewer", stream)
    ),
  ]);
};
