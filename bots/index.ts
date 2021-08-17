import {
  createStream,
  createUser,
  joinStream,
  stopStream,
} from "./src/procedures";
import { initMediasoupWorker } from "./src/media";

const runStreamer = async () => {
  const clientRecord = await createUser();
  await createStream(clientRecord);

  setTimeout(async () => {
    await stopStream(clientRecord);
    await clientRecord.api.user.delete();

    clientRecord.api.close();
  }, 60000);
};

const runViewer = async () => {
  const clientRecord = await createUser();

  const { feed } = await clientRecord.api.feed.get(0);

  if (feed.length === 0) {
    console.log("No streams in feed, exiting");
    await clientRecord.api.user.delete();

    return;
  }

  const streamToWatch = feed[0];

  console.log(`joining stream ${streamToWatch.id}`);
  await joinStream(streamToWatch.id, clientRecord);
};

const main = async () => {
  await initMediasoupWorker();

  runStreamer();

  setTimeout(() => {
    runViewer();
  }, 2000);
};

main();
