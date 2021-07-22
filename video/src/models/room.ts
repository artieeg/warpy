import { Router } from "mediasoup/lib/Router";
import { Worker } from "mediasoup/lib/Worker";
import { IPeer } from "./peer";

type Peers = Record<string, IPeer>;

export interface IRoom {
  router: Router;
  peers: Peers;
}

export type Rooms = Record<string, IRoom>;
