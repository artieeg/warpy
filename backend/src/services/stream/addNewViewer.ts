import { ParticipantDAL, UserDAO } from "@backend/dal";
import { IJoinStreamResponse } from "@warpy/lib";
import { BroadcastService, MediaService } from "..";

export const addNewViewer = async (
  stream: string,
  viewerId: string
): Promise<IJoinStreamResponse> => {
  const [viewer, recvNodeId] = await Promise.all([
    UserDAO.findById(viewerId),
    MediaService.getConsumerNodeId(),
  ]);

  if (!viewer) {
    throw new Error();
  }

  const participant = await ParticipantDAL.create({
    user_id: viewer.id,
    role: "viewer",
    stream,
  });

  await MediaService.assignUserToNode(viewerId, recvNodeId);
  const recvMediaParams = await MediaService.joinRoom(
    recvNodeId,
    viewerId,
    stream
  );

  await BroadcastService.broadcastNewViewer(participant);

  const [speakers, raisedHands, count] = await Promise.all([
    ParticipantDAL.getSpeakers(stream),
    ParticipantDAL.getWithRaisedHands(stream),
    ParticipantDAL.count(stream),
  ]);

  const mediaPermissionsToken = MediaService.createPermissionsToken({
    user: viewerId,
    room: stream,
    audio: false,
    video: false,
    recvNodeId,
  });

  return {
    speakers: speakers,
    raisedHands: raisedHands,
    count,
    mediaPermissionsToken,
    recvMediaParams,
  };
};
