import { ParticipantDAL } from "@backend/dal";
import {
  InternalError,
  NoPermissionError,
  UserNotFound,
} from "@backend/errors";
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
    throw new NoPermissionError();
  }

  const userToKickData = await ParticipantDAL.getById(userToKick);

  if (!userToKickData) {
    throw new UserNotFound();
  }

  const stream = userKickingData.stream;

  if (!stream) {
    return;
  }

  if (userToKickData?.stream !== stream) {
    throw new NoPermissionError();
  }

  const { sendNodeId, recvNodeId } = userToKickData;

  const [sendNodeResponse, recvNodeResponse] = await Promise.all([
    sendNodeId ? MessageService.kickUser(sendNodeId, stream, userToKick) : null,
    recvNodeId ? MessageService.kickUser(recvNodeId, stream, userToKick) : null,
  ]);

  if (sendNodeResponse?.status !== "ok" && recvNodeResponse?.status !== "ok") {
    throw new InternalError();
  }

  const streamParticipantIds = await ParticipantDAL.getIdsByStream(stream);

  await ParticipantDAL.setBanStatus(userToKick, true);

  await BroadcastService.broadcastKickedUser({
    user: userToKick,
    ids: streamParticipantIds,
  });
};
