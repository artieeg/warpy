import { ICreateTransportParams, MediaAPIStream } from "./types";
import { Transport } from "mediasoup-client/lib/Transport";
import { Device } from "mediasoup-client";
import { APIClient } from "@warpy/api";
import {
  Consumer,
  ConsumerOptions,
  MediaKind,
  Producer,
} from "mediasoup-client/lib/types";

export class MediaClient {
  constructor(
    public recvDevice: Device,
    public sendDevice: Device,
    private api: APIClient,
    public permissionsToken: string
  ) {}

  async createTransport({
    roomId,
    device,
    direction,
    options,
    isProducer,
  }: ICreateTransportParams): Promise<Transport> {
    const transportOptions =
      direction === "recv"
        ? options.recvTransportOptions
        : options.sendTransportOptions;

    const transport =
      direction === "recv"
        ? device.createRecvTransport(transportOptions)
        : device.createSendTransport(transportOptions);

    transport.on("connect", ({ dtlsParameters }, callback, _errback) => {
      if (direction === "send") {
        this.api.media.onceSendTransportConnected(() => {
          callback();
        });
      } else {
        this.api.media.onceRecvTransportConnected(callback);
      }

      this.api.media.connectTransport(
        {
          transportId: transportOptions.id,
          dtlsParameters,
          direction,
          roomId: roomId,
          mediaPermissionsToken: this.permissionsToken,
        },
        isProducer
      );
    });

    if (direction === "send") {
      transport.on("produce", (produceParams, callback, errback) => {
        console.log("producing new track");
        console.log(produceParams.kind);

        const { kind, rtpParameters, appData } = produceParams;

        this.api.observer.once("@media/send-track-created", (data: any) => {
          const id = data.id;

          if (id !== null) {
            callback({ id });
          } else {
            errback();
          }
        });

        this.api.media.newTrack({
          transportId: transportOptions.id,
          kind,
          rtpParameters,
          rtpCapabilities: device!.rtpCapabilities,
          paused: false,
          roomId: roomId,
          appData,
          direction,
          mediaPermissionsToken: this.permissionsToken,
        });
      });
    }

    transport.on("connectionstatechange", (_state) => {
      //TODO
    });

    return transport;
  }

  async consumeRemoteStream(
    options: ConsumerOptions,
    user: string,
    transport: Transport
  ): Promise<Consumer> {
    const consumer = await transport.consume({
      ...options,
      appData: {
        user,
        producerId: options.producerId,
        mediaTag: "remote-media",
      },
    });

    return consumer;
  }

  async sendMediaStream(
    track: MediaAPIStream,
    kind: MediaKind,
    sendTransport: Transport
  ): Promise<Producer> {
    const producer = await sendTransport.produce({
      track: track as any,
      appData: { kind },
    });

    return producer;
  }

  async consumeRemoteStreams(stream: string, transport: Transport) {
    const { consumerParams } = await this.api.media.getRecvTracks({
      rtpCapabilities: this.recvDevice.rtpCapabilities,
      stream,
      mediaPermissionsToken: this.permissionsToken,
    });

    const consumersPromises: Promise<Consumer>[] = consumerParams.map(
      (params: any) =>
        transport.consume({
          ...params.consumerParameters,
          appData: {
            user: params.consumerParameters.user,
            producerId: params.consumerParameters.producerId,
            mediaTag: "media-" + Math.random(),
          },
        })
    );

    const consumers = await Promise.all(consumersPromises);

    return consumers;
  }
}
