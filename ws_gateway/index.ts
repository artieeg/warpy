import { onJoinStream } from "@app/handlers";
import { IMessage } from "@app/models";
import ws from "ws";

const PORT = Number.parseInt(process.env.PORT || "10000");

const server = new ws.Server({
  port: PORT,
});

type Handlers = { [key: string]: (data: any) => Promise<void> };
const handlers: Handlers = {
  "join-stream": onJoinStream,
};

server.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const message: IMessage = JSON.parse(msg.toString());

    const { event, data } = message;

    handlers[event](data);
  });
});
