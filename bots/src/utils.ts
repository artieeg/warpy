import { APIClient, WebSocketConn } from "@warpy/api";
import WebSocket from "ws";
import { UserRecord } from "./types";

export const createAPIClient = (url: string) => {
  return new Promise<APIClient>((resolve) => {
    const client = APIClient(new WebSocketConn(new WebSocket(url)));

    //Little timeout to establish the connection
    setTimeout(() => {
      resolve(client);
    }, 1000);
  });
};

type NewRecvTransportParams = {
  record: UserRecord;
  stream: string;
  recvTransportOptions: any;
  routerRtpCapabilities: any;
};

export const createRecvTransport = async (params: NewRecvTransportParams) => {
  const { stream, record, recvTransportOptions, routerRtpCapabilities } =
    params;

  if (!record.media) {
    throw new Error("User's media client is not initialized");
  }

  await record.recvDevice.load({ routerRtpCapabilities });

  const newTransport = await record.media.createTransport({
    roomId: stream,
    device: record.recvDevice as any,
    direction: "recv",
    options: { recvTransportOptions },
    isProducer: false,
  });

  return newTransport;
};

export const getStreamIdFromFeed = async (record: UserRecord) => {
  const { feed } = await record.api.feed.get(0);

  if (feed.length === 0) {
    throw new Error("No streams in feed");
  }

  return feed[Math.floor(Math.random() * feed.length)].id;
};
