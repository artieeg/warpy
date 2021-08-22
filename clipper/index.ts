import "module-alias/register";
import dotenv from "dotenv";

dotenv.config();

import { onRecordRequest } from "@clipper/handlers";
import { initMessageService, onMessage } from "./src/services";

const main = () => {
  initMessageService();

  onMessage("record-request", onRecordRequest);

  console.log("Started Clipper service");
};

main();
