import "module-alias/register";
import dotenv from "dotenv";

dotenv.config();

import { onRecordRequest } from "@clipper/handlers";
import { initMessageService, onMessage } from "./src/services";
import { initPreviewsStorage } from "@clipper/services/preview_storage";

const main = async () => {
  await initPreviewsStorage();
  await initMessageService();

  onMessage("record-request", onRecordRequest);

  console.log("Started Clipper service");
};

main();
