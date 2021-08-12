import {
  MessageHandler,
  Participant,
  INewStream,
  INewStreamResponse,
} from "@warpy/lib";
import {
  StreamService,
  FeedService,
  MediaService,
  UserService,
  ParticipantService,
} from "@backend/services";

export const onNewStream: MessageHandler<INewStream, INewStreamResponse> =
  async (params, respond) => {
    const { owner, title, hub } = params;
    const userData = await UserService.getUserById(owner);

    const [recvMediaNode, sendMediaNode] = await Promise.all([
      MediaService.getConsumerNodeId(),
      MediaService.getProducerNodeId(),
    ]);

    if (!recvMediaNode || !userData) {
      return;
    }

    const stream = await StreamService.createNewStream(owner, title, hub);
    await FeedService.addNewCandidate(stream);

    const speakers = [
      Participant.fromUser(userData, "streamer", stream.id.toString()),
    ];

    const streamId = stream.id;

    await Promise.all([
      ParticipantService.addParticipant(userData, streamId, "streamer"),
      ParticipantService.setCurrentStreamFor(owner, streamId),
    ]);

    const media = await MediaService.createRoom(owner, streamId);

    await MediaService.assignUserToNode(owner, recvMediaNode);
    await MediaService.joinRoom(recvMediaNode, owner, streamId);

    console.log("send media node", sendMediaNode);
    console.log("recv media node", recvMediaNode);
    const mediaPermissionsToken = MediaService.createPermissionsToken({
      room: streamId,
      user: owner,
      audio: true,
      video: true,
      sendNodeId: sendMediaNode,
      recvNodeId: recvMediaNode,
    });
    console.log("token", mediaPermissionsToken);

    console.log("response", {
      stream: stream.id,
      media,
      speakers,
      count: 1,
      mediaPermissionsToken,
    });

    respond({
      stream: stream.id,
      media,
      speakers,
      count: 1,
      mediaPermissionsToken,
    });
  };
