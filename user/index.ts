import "module-alias/register";
import { init } from "@app/nats";

import express from "express";
import routes from "@app/routes";
import * as db from "@app/db";

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("No port specified");
}
const main = async () => {
  await db.connect();
  await init();

  app.listen(Number.parseInt(PORT), `0.0.0.0`, () => {
    console.log(`Started user service on port ${PORT}`);
  });
};

main();
