import "module-alias/register";

import express from "express";
import routes from "@app/routes";
import * as nats from "@app/nats";

const app = express();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("No port specified");
}

const main = async () => {
  await nats.init();

  app.use(express.json());
  app.use(routes);

  app.listen(Number.parseInt(PORT), "0.0.0.0", () => {
    console.log(`Started streams service on ${PORT}`);
  });
};

main();
