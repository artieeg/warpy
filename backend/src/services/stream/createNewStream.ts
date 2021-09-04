import { INewStreamResponse, Participant } from "@warpy/lib";
import { MediaService } from "@backend/services";
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

  const participant = await ParticipantDAL.create({
    user_id: streamer.id,
    role: "streamer",
  });

  const stream = await StreamDAL.create({
    owner_id: participant.id,
    title,
    hub,
    live: true,
    preview: null,
    reactions: 0,
  });

  await ParticipantDAL.setStream(participant.id, stream.id);

  const speakers = [
    Participant.fromUser(streamer, "streamer", stream.id.toString()),
  ];

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
