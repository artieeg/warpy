import { ParticipantDAL } from "@backend/dal";
import { BroadcastService } from "../broadcast";

export const kickFromStream = async ({
  user,
  userToKick,
}: {
  user: string;
  userToKick: string;
}) => {
  const userKickingData = await ParticipantDAL.getById(user);

  if (userKickingData?.role !== "streamer") {
    throw new Error("Permission Error");
  }

  const userToKickData = await ParticipantDAL.getById(userToKick);

  const stream = userKickingData.stream;

  if (!stream) {
    return;
  }

  if (userToKickData?.stream !== stream) {
    throw new Error("Can't kick this participant");
  }

  const streamParticipantIds = await ParticipantDAL.getIdsByStream(stream);

  await BroadcastService.broadcastKickedUser({
    user: userToKick,
    ids: streamParticipantIds,
  });
};
