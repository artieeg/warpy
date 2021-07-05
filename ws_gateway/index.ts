import { IMessage } from "@app/models";
import ws from "ws";

const PORT = Number.parseInt(process.env.PORT || "10000");

const server = new ws.Server({
  port: PORT,
});

server.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const message: IMessage = JSON.parse(msg.toString());

    const { event, data } = message;

    if (event === "join-stream") {
      //
    }
  });
});
