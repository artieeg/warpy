import { Worker, createWorker } from "mediasoup-client-aiortc";
import { Device } from "mediasoup-client";
import * as fs from "fs";
import * as path from "path";

let worker: Worker;

export const initMediasoupWorker = async () => {
  worker = await createWorker();
};

export const createDevice = () => {
  return new Device({
    handlerFactory: worker.createHandlerFactory(),
  });
};

const files = fs.readdirSync(path.resolve(__dirname, "../test-media"));

export const getMediaStream = async () => {
  const filename = files[Math.floor(Math.random() * files.length)];

  const file = `file:/${path.resolve(__dirname, "../test-media")}/${filename}`;

  const stream = await worker.getUserMedia({
    audio: {
      source: "file",
      file,
    },
    video: {
      source: "file",
      file,
    },
  });

  return stream;
};
