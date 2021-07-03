import "module-alias/register";

import express from "express";
import routes from "@app/routes";
import * as nats from "@app/nats";
import * as db from "@app/db";

const app = express();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("No port specified");
}

const main = async () => {
  await nats.init();
  await db.connect();

  app.use(express.json());
  app.use(routes);

  app.listen(Number.parseInt(PORT), "0.0.0.0", () => {
    console.log(`Started streams service on ${PORT}`);
  });
};

main();
