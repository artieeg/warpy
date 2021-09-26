import { ParticipantDAL, UserDAO } from "@backend/dal";
import { IJoinStreamResponse, IParticipant } from "@warpy/lib";
import { BroadcastService, MediaService } from "..";
import { BannedFromStreamError, UserNotFound } from "@backend/errors";

const findOrCreateParticipant = async (
  id: string,
  stream: string,
  recvNodeId: string
): Promise<IParticipant> => {
  try {
    const existingParticipant = await ParticipantDAL.getByIdAndStream(
      id,
      stream
    );

    if (existingParticipant.isBanned) {
      throw new BannedFromStreamError("User is banned from this stream");
    }

    const participant = await ParticipantDAL.updateOne(id, { recvNodeId });

    return participant;
  } catch (e) {
    if (e instanceof BannedFromStreamError) {
      throw e;
    }

    const participant = await ParticipantDAL.create({
      user_id: id,
      role: "viewer",
      stream,
      recvNodeId,
    });

    return participant;
  }
};

export const addNewViewer = async (
  stream: string,
  viewerId: string
): Promise<IJoinStreamResponse> => {
  const [viewer, recvNodeId] = await Promise.all([
    UserDAO.findById(viewerId),
    MediaService.getConsumerNodeId(),
  ]);

  if (!viewer) {
    throw new UserNotFound();
  }

  const participant = await findOrCreateParticipant(
    viewer.id,
    stream,
    recvNodeId
  );

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
