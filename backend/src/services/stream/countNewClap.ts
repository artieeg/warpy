import { StreamDAL } from "@backend/dal";
import { observer } from "./observer";

/**
 * Stores pendign clap count updates;
 */
export const batchedClapUpdates: Record<string, number> = {};

const reset = () => {
  Object.keys(batchedClapUpdates).forEach((key) => {
    delete batchedClapUpdates[key];
  });
};

export const syncClaps = async (): Promise<void> => {
  const promises: Promise<{
    id: string;
    claps: number;
  }>[] = [];

  Object.entries(batchedClapUpdates).forEach(([stream, claps]) => {
    promises.push(StreamDAL.incClapsCount(stream, claps));
  });

  const results = await Promise.all(promises);

  results.forEach((result) => observer.emit("claps-update", result));

  reset();
};

export const runClapsSync = (): void => {
  setInterval(syncClaps, 1000);
};

export const countNewClap = async (
  _user: string,
  stream: string
): Promise<void> => {
  if (!batchedClapUpdates[stream]) {
    batchedClapUpdates[stream] = 1;
  } else {
    batchedClapUpdates[stream]++;
  }
};
