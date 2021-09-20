import { ParticipantDAL } from "@backend/dal";
import { BroadcastService } from "../broadcast";
import { MessageService } from "../message";

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

  if (!userToKickData) {
    throw new Error("User to kick does not exist");
  }

  const stream = userKickingData.stream;

  if (!stream) {
    return;
  }

  if (userToKickData?.stream !== stream) {
    throw new Error("Can't kick this participant");
  }

  const { sendNodeId, recvNodeId } = userToKickData;

  const [sendNodeResponse, recvNodeResponse] = await Promise.all([
    sendNodeId ? MessageService.kickUser(sendNodeId, userToKick) : null,
    recvNodeId ? MessageService.kickUser(recvNodeId, userToKick) : null,
  ]);

  if (sendNodeResponse?.status !== "ok" && recvNodeResponse?.status !== "ok") {
    throw new Error("Failed to kick from the media nodes");
  }

  const streamParticipantIds = await ParticipantDAL.getIdsByStream(stream);

  await ParticipantDAL.setBanStatus(userToKick, true);

  await BroadcastService.broadcastKickedUser({
    user: userToKick,
    ids: streamParticipantIds,
  });
};
