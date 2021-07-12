import os from "os";
import { createWorker } from "mediasoup";
import { IWorker } from "@app/models";
import { Direction } from "@app/types";
import { Router, WebRtcTransport } from "mediasoup/lib/types";
import { config } from "@app/config";

let latestUsedWorkerIdx = -1;
const workers: IWorker[] = [];

export const startWorkers = async () => {
  const cpus = os.cpus().length;

  for (let i = 0; i < cpus; i++) {
    let worker = await createWorker({});

    worker.on("died", () => {
      process.exit(1);
    });

    const router = await worker.createRouter();

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
  direction: Direction,
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

export const getOptionsFromTransport = (transport: WebRtcTransport) => ({
  id: transport.id,
  iceParameters: transport.iceParameters,
  iceCandidates: transport.iceCandidates,
  dtlsParameters: transport.dtlsParameters,
});
