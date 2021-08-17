import {
  createStream,
  createUser,
  joinStream,
  speak,
  stopStream,
} from "./src/procedures";
import { initMediasoupWorker } from "./src/media";

const runStreamer = async () => {
  const record = await createUser();
  await createStream(record);

  setTimeout(async () => {
    await stopStream(record);
    await record.api.user.delete();

    record.api.close();
  }, 60000);
};

const runViewer = async () => {
  const record = await createUser();

  const { feed } = await record.api.feed.get(0);

  if (feed.length === 0) {
    console.log("No streams in feed, exiting");
    await record.api.user.delete();

    return;
  }

  const streamToWatch = feed[0];

  console.log(`joining stream ${streamToWatch.id}`);
  await joinStream(streamToWatch.id, record);

  return record;
};

const runSpeaker = async () => {
  const record = await runViewer();

  if (!record) {
    return;
  }

  speak(record);
};

const main = async () => {
  await initMediasoupWorker();

  runStreamer();

  setTimeout(() => {
    runViewer();
    runSpeaker();
  }, 2000);
};

main();
