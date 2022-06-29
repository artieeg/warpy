import { MessageService, SFUService } from "@media/services";
import { MessageHandler } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleEgressMediaRequest: MessageHandler<any, any> = async (
  data,
  respond
) => {
  const { stream, node } = data;

  console.log("requested forwarding of", stream, "to", node);

  const { peers, forwardingToNodeIds } = rooms[stream];

  //Check if we forward all room's media to this node already
  if (forwardingToNodeIds.includes(node)) {
    respond({ ok: "ok" });
    return;
  }

  const pipeRouterId = SFUService.getPipeRouter().id;

  Object.entries(peers).forEach(([userId, peer]) => {
    const producers = [
      peer.producer.audio[pipeRouterId],
      peer.producer.video[pipeRouterId],
    ].filter((p) => !!p);

    producers.forEach(async (producer) => {
      const pipeConsumer = await SFUService.createPipeConsumer(
        producer.id,
        node
      );

      producer.appData.forwadingToNodes = [
        ...(producer.appData.forwadingToNodes ?? []),
        node,
      ];

      MessageService.sendNewProducer(node, {
        userId,
        roomId: stream,
        id: pipeConsumer.id,
        kind: pipeConsumer.kind,
        rtpParameters: pipeConsumer.rtpParameters,
        rtpCapabilities: peer.rtpCapabilities,
        appData: pipeConsumer.appData,
      });
    });
  });

  forwardingToNodeIds.push(node);

  respond({ ok: "ok" });
};
