import EventEmitter from "events";

export const observer = new EventEmitter();

type ClapsUpdateCallback = (params: { stream: string; claps: number }) => void;

export const onReactionUpdate = (cb: ClapsUpdateCallback): void => {
  observer.on("reactions-update", cb);
};
