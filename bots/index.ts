import { createStream, createUser, stopStream } from "./src/procedures";
import { initMediasoupWorker } from "./src/media";
import * as path from "path";

const main = async () => {
  await initMediasoupWorker();

  setTimeout(async () => {
    const clientRecord = await createUser();
    await createStream(clientRecord);

    console.log("sending media");
    setTimeout(async () => {
      await stopStream(clientRecord);
      await clientRecord.api.user.delete();

      clientRecord.api.close();
    }, 60000);
  }, 1000);
};

main();
