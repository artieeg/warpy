import WebSocket from "ws";

type Registry = { [key: string]: WebSocket };
const registry: Registry = {};

export const addSocket = (user: string, ws: WebSocket) => {
  registry[user] = ws;
};

export const deleteSocket = (user: string) => {
  delete registry[user];
};
