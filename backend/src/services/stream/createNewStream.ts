import { INewStreamResponse, Participant } from "@warpy/lib";
import { FeedService, MediaService } from "@backend/services";
import { StreamDAL } from "@backend/dal/stream_dal";
import { ParticipantDAL, UserDAL } from "@backend/dal";

export const createNewStream = async (
  owner: string,
  title: string,
  hub: string
): Promise<INewStreamResponse> => {
  const streamer = await UserDAL.findById(owner);

  //Get nodes for sending and receiving media
  const [recvMediaNode, sendMediaNode] = await Promise.all([
    MediaService.getConsumerNodeId(),
    MediaService.getProducerNodeId(),
  ]);

  if (!streamer) {
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

  await ParticipantDAL.createNewParticipant(streamer.id, stream.id, "streamer");

  const media = await MediaService.createRoom(owner, stream.id);

  await MediaService.assignUserToNode(owner, recvMediaNode);
  const recvMediaParams = await MediaService.joinRoom(
    recvMediaNode,
    owner,
    stream.id
  );

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
    recvMediaParams,
  };
};
