import { IParticipant } from "@app/models";
import { Roles } from "@app/types";
import redis from "redis";

const URL = process.env.PARTICIPANTS_CACHE || "redis://127.0.0.1:6375/5";

const client = redis.createClient({
  url: URL,
});

export const init = async () => {};

export const addParticipant = async (participant: IParticipant) => {
  const user = participant.id;
  const stream = participant.stream;

  const streamKey = `stream_${stream}`;
  const participantKey = `user_${user}`;

  const role = participant.role || "viewer";

  const addUserPromise = new Promise<void>((resolve, reject) => {
    client.hset(streamKey, user, role, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });

  const setCurrentStreamPromise = new Promise<void>((resolve, reject) => {
    client.set(participantKey, stream, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });

  await Promise.all([addUserPromise, setCurrentStreamPromise]);
};

export const setParticipantRole = async (
  stream: string,
  user: string,
  role: Roles
) => {};
export const removeParticipant = async (participant: IParticipant) => {};
export const getStreamParticipants = async (streamId: string) => {
  return [] as string[];
};
export const removeAllParticipants = async (streamId: string) => {};
export const getCurrentStreamFor = async (
  user: string
): Promise<string | null> => {
  return null;
};

export const setCurrentStreamFor = async (participant: IParticipant) => {};
export const getRoleFor = async (
  user: string,
  stream: string
): Promise<Roles> => {
  return "viewer";
};
