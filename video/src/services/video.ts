import os from "os";
import { createWorker } from "mediasoup";
import { IWorker } from "@app/models";

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
