import "module-alias/register";
import routes from "@app/routes";
import express from "express";
import {
  FeedService,
  FeedsCacheService,
  StatsCacheService,
  MessageService,
  DatabaseService,
} from "@app/services";

const PORT = Number.parseInt(process.env.PORT || "10000");

const main = async () => {
  FeedsCacheService.connect();
  StatsCacheService.connect();
  await DatabaseService.connect();
  await MessageService.init();

  MessageService.on("new-stream", FeedService.onNewCandidate);

  const app = express();
  app.use(express.json());
  app.use(routes);

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Started Feeds service");
  });
};

main();
