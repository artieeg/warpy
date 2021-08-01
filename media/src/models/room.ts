import { Router } from "mediasoup/lib/Router";
import { Worker } from "mediasoup/lib/Worker";
import { Peer } from "./peer";

type Peers = Record<string, Peer>;

export interface IRoom {
  router: Router;
  peers: Peers;
}

export type Rooms = Record<string, IRoom>;
