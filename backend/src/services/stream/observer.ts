import { Reaction } from "@warpy/lib";
import EventEmitter from "events";

export const observer = new EventEmitter();

type ClapsUpdateCallback = (params: {
  stream: string;
  reactions: Reaction[];
}) => Promise<void>;

export const onReactionUpdate = (cb: ClapsUpdateCallback): void => {
  observer.on("reactions-update", cb);
};
