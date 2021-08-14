import { User } from "@backend/models";
import { INewStreamResponse, Participant } from "@warpy/lib";
import { FeedService, MediaService } from "@backend/services";
import { StreamDAL } from "@backend/dal/stream_dal";
import { ParticipantDAL } from "@backend/dal";

export const createNewStream = async (
  owner: string,
  title: string,
  hub: string
): Promise<INewStreamResponse> => {
  const streamer = await User.findOne(owner);

  //Get nodes for sending and receiving media
  const [recvMediaNode, sendMediaNode] = await Promise.all([
    MediaService.getConsumerNodeId(),
    MediaService.getProducerNodeId(),
  ]);

  if (!recvMediaNode || !streamer || !sendMediaNode) {
    throw new Error();
  }

  const stream = await StreamDAL.createNewStream({
    owner,
    title,
    hub,
    live: true,
  });

  await FeedService.addNewCandidate(stream);

  const speakers = [
    Participant.fromUser(streamer, "streamer", stream.id.toString()),
  ];

  await Promise.all([
    ParticipantDAL.createNewParticipant(streamer.id, stream.id, "streamer"),
    ParticipantDAL.setCurrentStreamFor(owner, stream.id),
  ]);

  const media = await MediaService.createRoom(owner, stream.id);

  await MediaService.assignUserToNode(owner, recvMediaNode);
  await MediaService.joinRoom(recvMediaNode, owner, stream.id);

  //Allow sending audio and video
  const mediaPermissionsToken = MediaService.createPermissionsToken({
    room: stream.id,
    user: owner,
    audio: true,
    video: true,
    sendNodeId: sendMediaNode,
    recvNodeId: recvMediaNode,
  });

  return {
    stream: stream.id,
    media,
    speakers,
    count: 1,
    mediaPermissionsToken,
  };
};
