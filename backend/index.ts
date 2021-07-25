import "module-alias/register";

import express from "express";
import routes from "@app/routes";
import { DatabaseService, FeedService, StreamService } from "@app/services";
import { IStream } from "@app/models";

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("No port specified");
}
const main = async () => {
  await DatabaseService.connect();

  StreamService.observer.on("stream-new", (stream: IStream) => {
    FeedService.onNewCandidate(stream);
  });

  StreamService.observer.on("stream-ended", (id: string) => {
    FeedService.onRemoveCandidate(id);
  });

  app.listen(Number.parseInt(PORT), `0.0.0.0`, () => {
    console.log(`Started on port ${PORT}`);
  });
};

main();
