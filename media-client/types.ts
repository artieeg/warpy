import { MediaDirection, MediaKind } from "@warpy/lib";
import { Device } from "mediasoup-client";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/types";
import { MediaStream } from "react-native-webrtc";
import { AiortcMediaStream } from "mediasoup-client-aiortc";
import { APIClient } from "@warpy/api";

//TODO: create a union type over MediaStream and AiortcMediaStream
export type MediaAPIStream = MediaStream | AiortcMediaStream;

export type SendMediaStreamOptions = {
  sendTransportOptions: {
    audio: TransportOptions;
    video: TransportOptions;
  };
};

export interface ICreateTransportParams {
  roomId: string;
  device: Device;
  direction: MediaDirection;
  options: any;
  isProducer: boolean;
  mediaKind?: MediaKind;
}

export type CreateTransport = (
  params: ICreateTransportParams
) => Promise<Transport>;

export type SendMediaStream = (
  media: MediaAPIStream,
  stream: string,
  options: SendMediaStreamOptions,
  kind: MediaKind
) => Promise<void>;

export type ConsumeRemoteStream = (
  consumerParameters: any,
  user: string,
  transport: Transport
) => Promise<Consumer>;

export type ConsumeRemoteStreams = (
  user: string,
  stream: string,
  transport: Transport
) => Promise<Consumer[]>;

interface IMediaAPIParams {
  recvDevice: Device;
  sendDevice: Device;
  api: APIClient;
  permissionsToken: string | null;
}

interface IMediaAPI {
  sendMediaStream: SendMediaStream;

  createTransport: CreateTransport;

  consumeRemoteStream: (
    options: ConsumerOptions,
    user: string,
    transport: Transport
  ) => Promise<Consumer>;

  consumeRemoteStreams: (
    user: string,
    stream: string,
    transport: Transport
  ) => Promise<Consumer[]>;
}

export type MediaAPIFactory = (params: IMediaAPIParams) => IMediaAPI;
