import { CreateTransport } from "./types";
import { APIClient } from "@warpy/api";

export const createTransportFactory =
  (api: APIClient): CreateTransport =>
  async (params) => {
    const { roomId, permissionsToken, device, direction, options, isProducer } =
      params;

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
        api.media.onceSendTransportConnected(() => {
          callback();
        });
      } else {
        api.media.onceRecvTransportConnected(callback);
      }

      api.media.connectTransport(
        {
          transportId: transportOptions.id,
          dtlsParameters,
          direction,
          roomId: roomId,
          mediaPermissionsToken: permissionsToken,
        },
        isProducer
      );
    });

    if (direction === "send") {
      transport.on("produce", (produceParams, callback, errback) => {
        const { kind, rtpParameters, appData } = produceParams;

        api.observer.once("@media/send-track-created", (data: any) => {
          const id = data.id;

          if (id !== null) {
            callback({ id });
          } else {
            errback();
          }
        });

        api.media.newTrack({
          transportId: transportOptions.id,
          kind,
          rtpParameters,
          rtpCapabilities: device!.rtpCapabilities,
          paused: false,
          roomId: roomId,
          appData,
          direction,
          mediaPermissionsToken: permissionsToken,
        });
      });
    }

    transport.on("connectionstatechange", (_state) => {
      //TODO
    });

    return transport;
  };
