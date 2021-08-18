import { Worker, createWorker } from "mediasoup-client-aiortc";
import { Device } from "mediasoup-client";
import * as fs from "fs";
import * as path from "path";

let worker: Worker;

export const initMediasoupWorker = async () => {
  worker = await createWorker({
    logLevel: "debug",
  });
};

export const createDevice = () => {
  return new Device({
    handlerFactory: worker.createHandlerFactory(),
  });
};

const files = fs.readdirSync(path.resolve(__dirname, "../test-media"));
const videos = files.filter((file) => file.includes("mp4"));
const audio = files.filter((file) => file.includes("ogg"));

if (videos.length === 0) {
  throw new Error("No .webm (VP8) files in test-media directory");
}

if (audio.length === 0) {
  throw new Error("No .ogg (OPUS) files in test-media directory");
}

export const getAudioStream = async () => {
  const filename = audio[Math.floor(Math.random() * audio.length)];

  const file = `file:/${path.resolve(__dirname, "../test-media")}/${filename}`;

  const stream = await worker.getUserMedia({
    audio: {
      source: "file",
      file,
    },
    video: false,
  });

  return stream;
};

export const getMediaStream = async () => {
  const filename = videos[Math.floor(Math.random() * videos.length)];

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
