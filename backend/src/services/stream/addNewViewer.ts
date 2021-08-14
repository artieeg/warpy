import { ParticipantDAL, UserDAL } from "@backend/dal";
import { IJoinStreamResponse } from "@warpy/lib";
import { BroadcastService, MediaService } from "..";

export const addNewViewer = async (
  stream: string,
  viewerId: string
): Promise<IJoinStreamResponse> => {
  const [viewer, recvNodeId] = await Promise.all([
    UserDAL.findById(viewerId),
    MediaService.getConsumerNodeId(),
  ]);

  if (!viewer || !recvNodeId) {
    throw new Error();
  }

  const participant = await ParticipantDAL.createNewParticipant(
    viewer.id,
    stream
  );

  await MediaService.assignUserToNode(viewerId, recvNodeId);

  await Promise.all([
    BroadcastService.broadcastNewViewer(participant),
    MediaService.joinRoom(recvNodeId, viewerId, stream),
  ]);

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
  };
};
