import { APIClient, WebSocketConn } from "@warpy/api";
import WebSocket from "ws";

export const createAPIClient = (url: string) => {
  return new Promise<APIClient>((resolve) => {
    const client = APIClient(new WebSocketConn(new WebSocket(url)));

    //Little timeout to establish the connection
    setTimeout(() => {
      resolve(client);
    }, 1000);
  });
};
