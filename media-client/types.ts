import { MediaDirection, MediaKind } from "@warpy/lib";
import { Device } from "mediasoup-client";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/types";
import { MediaStreamTrack } from "react-native-webrtc";
import { APIClient } from "@warpy/api";

//TODO: create a union type over MediaStream and AiortcMediaStream
export type MediaAPIStream = MediaStreamTrack | any;

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
  permissionsToken: string | null;
}

export type CreateTransport = (
  params: ICreateTransportParams
) => Promise<Transport>;

export type SendMediaStream = (
  media: MediaAPIStream,
  kind: MediaKind,
  sendTransport: Transport
) => Promise<Producer>;

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
