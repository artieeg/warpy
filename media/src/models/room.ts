import { AudioLevelObserver } from "mediasoup/lib/AudioLevelObserver";
import { Router } from "mediasoup/lib/Router";
import { Worker } from "mediasoup/lib/Worker";
import { Peer } from "./peer";

type Peers = Record<string, Peer>;

export interface IRoom {
  router: Router;
  peers: Peers;
  audioLevelObserver: AudioLevelObserver;
}

export type Rooms = Record<string, IRoom>;
