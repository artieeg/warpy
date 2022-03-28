import { AudioLevelObserver } from "mediasoup/node/lib/AudioLevelObserver";
import { Router } from "mediasoup/node/lib/Router";
import { IPeer } from "./peer";

type Peers = Record<string, IPeer>;

export interface IRoom {
  router: Router;
  peers: Peers;
  audioLevelObserver: AudioLevelObserver;
  forwardingToNodeIds: string[];
}

export type Rooms = Record<string, IRoom>;
