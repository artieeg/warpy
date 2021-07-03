import "module-alias/register";
import * as nats from "@app/nats";
import routes from "@app/routes";
import express from "express";

const PORT = Number.parseInt(process.env.PORT || "10000");

const main = async () => {
  await nats.init();

  const app = express();
  app.use(express.json());
  app.use(routes);

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Started Feeds service");
  });
};

main();
