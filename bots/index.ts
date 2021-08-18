import {
  createStream,
  createUser,
  joinStream,
  speak,
  stopBot,
} from "./src/procedures";
import { initMediasoupWorker } from "./src/media";
import { UserRecord } from "./src/types";
import { config } from "./config";
import { getStreamIdFromFeed } from "./src/utils";

const users: UserRecord[] = [];

const runStreamer = async () => {
  const record = await createUser();
  await createStream(record);

  return record;
};

const runViewer = async (stream?: string) => {
  const record = await createUser();

  const streamToWatch = stream || (await getStreamIdFromFeed(record));
  await joinStream(streamToWatch, record);

  return record;
};

const runSpeaker = async (stream?: string) => {
  const record = await runViewer(stream);
  speak(record);

  return record;
};

const main = async () => {
  await initMediasoupWorker();

  for (let i = 0; i < config.streams; i++) {
    const streamer = await runStreamer();
    users.push(streamer);

    const stream = streamer.stream;

    setTimeout(async () => {
      for (let a = 0; a < config.speakersPerStream; a++) {
        const speaker = await runSpeaker(stream);

        users.push(speaker);
      }
    }, 2000);

    setTimeout(async () => {
      for (let a = 0; a < config.viewersPerStream; a++) {
        const viewer = await runViewer(stream);

        users.push(viewer);
      }
    }, 5000);
  }

  setTimeout(() => {
    users.forEach((user) => stopBot(user));
  }, config.duration);
};

main();
