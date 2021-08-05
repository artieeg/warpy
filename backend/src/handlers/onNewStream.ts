import { MessageHandler, INewStream } from "@warpy/lib";
import {
  StreamService,
  FeedService,
  ConversationService,
  MediaService,
} from "@app/services";

export const onNewStream: MessageHandler<INewStream, any> = async (
  params,
  respond
) => {
  const { owner, title, hub } = params;

  const recvMediaNode = await MediaService.getConsumerNodeId();

  if (!recvMediaNode) {
    return;
  }

  const stream = await StreamService.createNewStream(owner, title, hub);
  await FeedService.addNewCandidate(stream);
  const { speakers, count } = await ConversationService.createNewConversation(
    stream.id.toString(),
    stream.owner.toString()
  );

  const streamId = stream.id;

  const media = await MediaService.createRoom(owner, streamId);

  await MediaService.assignUserToNode(owner, recvMediaNode);
  await MediaService.joinRoom(recvMediaNode, owner, streamId);

  respond({
    stream: stream.id,
    media,
    speakers,
    count,
  });
};
