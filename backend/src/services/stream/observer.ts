import EventEmitter from "events";

export const observer = new EventEmitter();

type ClapsUpdateCallback = (params: { stream: string; claps: number }) => void;

export const onClapsUpdate = (cb: ClapsUpdateCallback): void => {
  observer.on("claps-update", cb);
};
