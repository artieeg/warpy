import { User } from "@backend/models";
import { IJoinStreamResponse } from "@warpy/lib";
import { MediaService, ParticipantService } from "..";

export const addNewViewer = async (
  stream: string,
  viewerId: string
): Promise<IJoinStreamResponse> => {
  const [viewer, recvNodeId] = await Promise.all([
    User.findOne(viewerId),
    MediaService.getConsumerNodeId(),
  ]);

  if (!viewer || !recvNodeId) {
    throw new Error();
  }

  const participant = await ParticipantService.addParticipant(viewer, stream);

  await Promise.all([
    MediaService.assignUserToNode(viewerId, recvNodeId),
    ParticipantService.setCurrentStreamFor(viewerId, stream),
  ]);

  await Promise.all([
    ParticipantService.broadcastNewViewer(participant),
    MediaService.joinRoom(recvNodeId, viewerId, stream),
  ]);

  const [speakers, raisedHands, count] = await Promise.all([
    ParticipantService.getSpeakers(stream),
    ParticipantService.getUsersWithRaisedHands(stream),
    ParticipantService.getParticipantsCount(stream),
  ]);

  const mediaPermissionsToken = MediaService.createPermissionsToken({
    user: viewerId,
    room: stream,
    audio: false,
    video: false,
    recvNodeId,
  });

  return {
    speakers: speakers.map((i) => i.toJSON()),
    raisedHands: raisedHands.map((i) => i.toJSON()),
    count,
    mediaPermissionsToken,
  };
};
