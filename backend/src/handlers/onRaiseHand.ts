import { ParticipantService, UserService } from "@backend/services";
import { IRaiseHand, MessageHandler, Participant } from "@warpy/lib";

export const onRaiseHand: MessageHandler<IRaiseHand> = async (data) => {
  const { user } = data;
  console.log("user raising hand: ", user);
  const stream = await ParticipantService.getCurrentStreamFor(user);
  const userData = await UserService.getUserById(user);

  if (!stream || !userData) {
    return;
  }

  await Promise.all([
    ParticipantService.setRaiseHand(user, stream),
    ParticipantService.broadcastRaiseHand(
      Participant.fromUser(userData, "viewer", stream)
    ),
  ]);
};
