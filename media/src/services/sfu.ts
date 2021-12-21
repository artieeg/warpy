import os from "os";
import { createWorker } from "mediasoup";
import { Consumer, IPeer, IWorker } from "@media/models";
import { EgressTransports, MediaDirection, PipeConsumers } from "@media/types";
import {
  AudioLevelObserverVolume,
  PipeTransport,
  Producer,
  Router,
  RtpCapabilities,
  Transport,
} from "mediasoup/lib/types";
import { config } from "@media/config";
import { MessageService } from ".";
import EventEmitter from "events";
import { NodeInfo } from "@media/nodeinfo";
import { role } from "@media/role";

export const observer = new EventEmitter();

let latestUsedWorkerIdx = -1;

/** Worker to send/receive media to/from other media servers */
export let mediaNodeTransferWorker: IWorker;

export const workers: IWorker[] = [];

export const egressPipes: EgressTransports = {};

export let pipeToIngress: PipeTransport;

//TODO: not safe, check if port is open;
export const getPortForRemoteRTP = () => {
  return Math.floor(
    Math.random() *
      (config.mediasoup.worker.rtcMaxPort -
        config.mediasoup.worker.rtcMinPort +
        1) +
      config.mediasoup.worker.rtcMinPort
  );
};

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
      threshold: -50,
    });

    if (i === 0) {
      mediaNodeTransferWorker = { worker, router, audioLevelObserver };
    } else {
      workers.push({ worker, router, audioLevelObserver });
    }
  }

  return workers;
};

export const getPipeRouter = () => {
  return mediaNodeTransferWorker.router;
};

export const getRouter = () => {
  latestUsedWorkerIdx += 1;

  if (latestUsedWorkerIdx === workers.length) {
    latestUsedWorkerIdx = 0;
  }

  return workers[latestUsedWorkerIdx].router;
  //return workers[0].router; //TODO remove this
};

export const getAudioLevelObserver = () => {
  return role === "PRODUCER"
    ? mediaNodeTransferWorker.audioLevelObserver
    : workers[0].audioLevelObserver;
};

export const createPlainTransport = async (router: Router) => {
  return await router.createPlainTransport(config.mediasoup.plainRtpTransport);
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
  peerConsuming: IPeer,
  peerId: string
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
      producerPaused: false,
      user: peerId,
    },
  };
};

export const createPipeTransport = async () => {
  const { listenIps } = config.mediasoup.webRtcTransport;

  const router = mediaNodeTransferWorker.router;

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
  const transport = await createPipeTransport();

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

export const onActiveSpeakers = (cb: any) => {
  getAudioLevelObserver().on("silence", () => {
    console.log("is silent");
  });

  getAudioLevelObserver().on(
    "volumes",
    (volumes: AudioLevelObserverVolume[]) => {
      if (volumes.length === 0) {
        return;
      }

      const speakers: Record<
        string,
        {
          user: string;
          volume: number;
        }[]
      > = {};

      volumes.forEach((data) => {
        const { user, stream } = data.producer.appData;
        const volume = data.volume;

        const speakerVolumeData = { user, volume };

        if (!speakers[stream]) {
          speakers[stream] = [speakerVolumeData];
        } else {
          speakers[stream].push(speakerVolumeData);
        }
      });

      cb(speakers);
    }
  );
};
