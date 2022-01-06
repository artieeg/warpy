import { MessageService, SFUService } from "@media/services";
import { MessageHandler } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleEgressMediaRequest: MessageHandler<any, any> = async (
  data,
  respond
) => {
  const { stream, node } = data;

  console.log("req data", data);

  const room = rooms[stream];

  const pipeRouterId = SFUService.getPipeRouter().id;

  Object.entries(room.peers).forEach(([userId, peer]) => {
    const producers = [
      peer.producer.audio[pipeRouterId],
      peer.producer.video[pipeRouterId],
    ].filter((p) => !!p);

    producers.forEach(async (producer) => {
      const pipeConsumers = await SFUService.createPipeConsumers(producer.id);

      for (const [node, pipeConsumer] of Object.entries(pipeConsumers)) {
        MessageService.sendNewProducer(node, {
          userId,
          roomId: stream,
          id: pipeConsumer.id,
          kind: pipeConsumer.kind,
          rtpParameters: pipeConsumer.rtpParameters,
          rtpCapabilities: peer.rtpCapabilities,
          appData: pipeConsumer.appData,
        });
      }
    });
  });

  respond({ ok: "ok" });
};
