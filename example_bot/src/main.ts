import { config } from "./config";
import { APIClient, WebSocketConn } from "@warpy/api";
import WebSocket from "ws";

const socket = new WebSocketConn(new WebSocket(config.addr));
const api = APIClient(socket);

const main = async () => {
  const { status } = await api.bot.auth(config.token);

  console.log({ status });
  if (status !== "ok") {
    console.log("bot auth failed");
  }

  api.bot.onInvite((data) => {
    console.log("new invite", data);
  });
};

socket.onopen = () => {
  main();
};
