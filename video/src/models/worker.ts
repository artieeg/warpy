import { Router, Worker } from "mediasoup/lib/types";

export interface IWorker {
  worker: Worker;
  router: Router;
}