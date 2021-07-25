import "module-alias/register";

import express from "express";
import routes from "@app/routes";
import { DatabaseService, MessageService } from "@app/services";

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("No port specified");
}
const main = async () => {
  await DatabaseService.connect();
  await MessageService.init();

  app.listen(Number.parseInt(PORT), `0.0.0.0`, () => {
    console.log(`Started on port ${PORT}`);
  });
};

main();
