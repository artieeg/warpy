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

  const promises = Object.entries(peers)
    .map(([userId, peer]) => {
      const producers = [
        peer.producer.audio[pipeRouterId],
        peer.producer.video[pipeRouterId],
      ].filter((p) => !!p);

      return producers.map(async (producer) => {
        const pipeConsumer = await SFUService.createPipeConsumer(
          producer.id,
          node
        );

        producer.appData.forwadingToNodes = [
          ...((producer.appData.forwadingToNodes as any) ?? []),
          node,
        ];

        return MessageService.sendNewProducer(node, {
          userId,
          roomId: stream,
          id: pipeConsumer.id,
          kind: pipeConsumer.kind,
          rtpParameters: pipeConsumer.rtpParameters,
          rtpCapabilities: peer.rtpCapabilities,
          appData: pipeConsumer.appData,
          sendTrackToUser: false,
        });
      });
    })
    .reduce((p, c) => [...p, ...c]);

  console.log(promises);

  await Promise.all(promises);

  forwardingToNodeIds.push(node);

  respond({ ok: "ok" });
};
