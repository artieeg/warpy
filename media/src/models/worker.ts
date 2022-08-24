import { AudioLevelObserver, Router, Worker } from "mediasoup/node/lib/types";

export interface IWorker {
  worker: Worker;
  router: Router;
  audioLevelObserver: AudioLevelObserver;
}
