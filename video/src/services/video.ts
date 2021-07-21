import os from "os";
import { createWorker } from "mediasoup";
import { Consumer, IPeer, IWorker } from "@video/models";
import { MediaDirection } from "@video/types";
import {
  PipeTransport,
  Producer,
  Router,
  RtpCapabilities,
  Transport,
  WebRtcTransport,
} from "mediasoup/lib/types";
import { config } from "@video/config";
import { ITransportOptions } from "@warpy/lib";

let latestUsedWorkerIdx = -1;
const workers: IWorker[] = [];

//DEBUG
export let egressPipe: PipeTransport;

export const startWorkers = async () => {
  const cpus = os.cpus().length;

  for (let i = 0; i < cpus; i++) {
    let worker = await createWorker({});

    worker.on("died", () => {
      process.exit(1);
    });

    const router = await worker.createRouter({
      mediaCodecs: config.mediasoup.router.mediaCodecs,
    });

    workers.push({ worker, router });
  }

  return workers;
};

export const getWorker = () => {
  latestUsedWorkerIdx += 1;

  if (latestUsedWorkerIdx == workers.length - 1) {
    latestUsedWorkerIdx = 0;
  }

  return workers[latestUsedWorkerIdx];
};

export const createTransport = async (
  direction: MediaDirection,
  router: Router,
  peerId: string
) => {
  const {
    listenIps,
    initialAvailableOutgoingBitrate,
  } = config.mediasoup.webRtcTransport;

  const transport = await router.createWebRtcTransport({
    listenIps: listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
    appData: { peerId, clientDirection: direction },
  });
  return transport;
};

export const getOptionsFromTransport = (
  transport: WebRtcTransport
): ITransportOptions => ({
  id: transport.id,
  iceParameters: transport.iceParameters,
  iceCandidates: transport.iceCandidates,
  dtlsParameters: transport.dtlsParameters,
});

export const createConsumer = async (
  router: Router,
  producer: Producer,
  rtpCapabilities: RtpCapabilities,
  transport: Transport,
  user: string,
  peerConsuming: IPeer
): Promise<Consumer> => {
  if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
    throw new Error(
      `recv-track: client cannot consume ${producer.appData.peerId}`
    );
  }

  const consumer = await transport.consume({
    producerId: producer.id,
    rtpCapabilities,
    paused: false,
    appData: { user, mediaUserId: producer.appData.user },
  });

  peerConsuming.consumers.push(consumer);

  return {
    user: producer.appData.user,
    consumerParameters: {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
    },
  };
};

export const createPipeTransport = async (id: number) => {
  const { listenIps } = config.mediasoup.webRtcTransport;

  const router = workers[id].router;

  const transport = await router.createPipeTransport({
    listenIp: listenIps[0],
    enableRtx: true,
    enableSctp: true,
    enableSrtp: false,
  });

  return transport;
};

export const broadcastNewProducerToEgress = async (producer: Producer) => {
  const;
};
