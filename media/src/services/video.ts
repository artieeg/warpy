import os from "os";
import { createWorker } from "mediasoup";
import { Consumer, IPeer, IWorker } from "@media/models";
import { EgressTransports, MediaDirection, PipeConsumers } from "@media/types";
import {
  PipeTransport,
  Producer,
  Router,
  RtpCapabilities,
  Transport,
  WebRtcTransport,
} from "mediasoup/lib/types";
import { config } from "@media/config";
import { ITransportOptions } from "@warpy/lib";
import { MessageService } from ".";
import EventEmitter from "events";
import { NodeInfo } from "@media/nodeinfo";

export const observer = new EventEmitter();

let latestUsedWorkerIdx = -1;
export const workers: IWorker[] = [];

//DEBUG
//export let pipeToEgress: PipeTransport;
export const egressPipes: EgressTransports = {};

export let pipeToIngress: PipeTransport;

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

    const audioLevelObserver = await router.createAudioLevelObserver({
      interval: 300,
      threshold: -10,
    });

    workers.push({ worker, router, audioLevelObserver });
  }

  return workers;
};

export const getPipeRouter = () => {
  return workers[0].router;
};

export const getRouter = () => {
  latestUsedWorkerIdx += 1;

  if (latestUsedWorkerIdx == workers.length) {
    latestUsedWorkerIdx = 0;
  }

  //return workers[latestUsedWorkerIdx];
  return workers[0].router; //TODO remove this
};

export const getAudioLevelObserver = () => {
  return workers[0].audioLevelObserver;
};

export const createTransport = async (
  direction: MediaDirection,
  router: Router,
  peerId: string
) => {
  const { listenIps, initialAvailableOutgoingBitrate } =
    config.mediasoup.webRtcTransport;

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
      //producerPaused: consumer.producerPaused,
      producerPaused: false,
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

export const createPipeConsumers = async (producerId: string) => {
  const pipeConsumers: PipeConsumers = {};

  for (const [node, pipe] of Object.entries(egressPipes)) {
    pipeConsumers[node] = await pipe.consume({
      producerId,
    });
  }

  return pipeConsumers;
};

/*
export const broadcastNewProducerToEgress = async (
  user: string,
  room: string,
  producer: Producer
) => {
  try {
    const router = getPipeRouter();

    const pipeConsumer = await pipeToEgress!.consume({
      producerId: producer.id!,
    });

    const { id, kind, rtpParameters, appData } = pipeConsumer;

    MessageService.sendNewProducer({
      userId: user,
      roomId: room,
      id,
      kind,
      rtpParameters,
      rtpCapabilities: router.rtpCapabilities,
      appData,
    });

    console.log("new pipe consumer", pipeConsumer);

    return pipeConsumer;
  } catch (e) {
    console.error(e);
  }
};
*/

export const tryConnectToIngress = async () => {
  const transport = await createPipeTransport(0);

  pipeToIngress = transport;

  const remoteParams = await MessageService.tryConnectToIngress({
    node: NodeInfo.id,
    ip: transport.tuple.localIp,
    port: transport.tuple.localPort,
    srtp: transport.srtpParameters,
  });

  const { ip, port, srtp } = remoteParams;

  await transport.connect({ ip, port, srtpParameters: srtp });

  observer.emit("pipe-is-ready", remoteParams);
};
