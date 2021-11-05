import { APIClient, WebSocketConn } from "@warpy/api";
import { Worker, createWorker } from "mediasoup-client-aiortc";
import { MediaClient } from "@warpykit-sdk/client";
import { Device } from "mediasoup-client";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { config } from "./config";

const socket = new WebSocketConn(new WebSocket(config.addr));
const api = APIClient(socket);

let worker: Worker;

export const getAudioStream = async () => {
  const files = fs.readdirSync(path.resolve(__dirname, "../media"));
  const filename = files[Math.floor(Math.random() * files.length)];

  console.log("audio filename", filename);

  const file = `file:/${path.resolve(__dirname, "../media")}/${filename}`;

  const stream = await worker.getUserMedia({
    audio: {
      source: "file",
      file,
    },
    video: false,
  });

  return stream;
};

const main = async () => {
  worker = await createWorker({
    logLevel: "debug",
  });

  const { status } = await api.bot.auth(config.token);

  console.log({ status });
  if (status !== "ok") {
    console.log("bot auth failed");
  }

  api.bot.onInvite(async (data) => {
    console.log("new invite", data);
    const { mediaPermissionToken, sendMedia, recvMedia } = await api.bot.join(
      data.inviteDetailsToken
    );

    let mediaClient: MediaClient;

    mediaClient = new MediaClient(
      new Device({
        handlerFactory: worker.createHandlerFactory(),
      }),
      new Device({
        handlerFactory: worker.createHandlerFactory(),
      }),
      api,
      mediaPermissionToken
    );

    await mediaClient.recvDevice.load({
      routerRtpCapabilities: recvMedia.routerRtpCapabilities,
    });

    await mediaClient.sendDevice.load({
      routerRtpCapabilities: sendMedia.routerRtpCapabilities,
    });

    const sendTransport = await mediaClient.createTransport({
      roomId: data.stream,
      device: mediaClient.sendDevice,
      direction: "send",
      options: {
        sendTransportOptions: sendMedia.sendTransportOptions,
      },
      isProducer: true,
    });

    const stream = await getAudioStream();

    const audioProducer = await mediaClient.sendMediaStream(
      stream.getAudioTracks()[0],
      sendMedia,
      sendTransport
    );
    console.log(audioProducer);
  });
};

socket.onopen = () => {
  main();
};
