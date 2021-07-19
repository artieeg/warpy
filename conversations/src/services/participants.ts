import { IParticipant } from "@conv/models";
import { Roles } from "@conv/types";
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
) => {
  const streamKey = `stream_${stream}`;

  return new Promise<void>((resolve, reject) => {
    client.hset(streamKey, user, role, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

export const removeParticipant = async (participant: IParticipant) => {
  const user = participant.id;
  const stream = participant.stream;

  const userKey = `user_${user}`;
  const streamKey = `stream_${stream}`;

  //Remove user from stream participants hashmap
  const removeParticipantPromise = new Promise<void>((resolve, reject) => {
    client.hdel(streamKey, user, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });

  //Remove user's current stream record
  const removeCurrentStreamPromise = new Promise<void>((resolve, reject) => {
    client.del(userKey, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  await Promise.all([removeParticipantPromise, removeCurrentStreamPromise]);
};

export const getStreamParticipants = async (streamId: string) => {
  const streamKey = `stream_${streamId}`;

  return new Promise<string[]>((resolve, reject) => {
    client.hkeys(streamKey, (err, ids) => {
      if (err) {
        return reject(err);
      }
      resolve(ids);
    });
  });
};

export const removeAllParticipants = async (streamId: string) => {
  const streamKey = `stream_${streamId}`;

  const users = await getStreamParticipants(streamId);

  const removeParticipantsPromise = new Promise<void>((resolve, reject) => {
    client.del(streamKey, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });

  const removeCurrentStreamPromises: Promise<void>[] = users.map(
    (user) =>
      new Promise<void>((resolve) => {
        const userKey = `user_${user}`;
        client.del(userKey, () => {
          resolve();
        });
      })
  );

  Promise.all([removeParticipantsPromise, ...removeCurrentStreamPromises]);
};

export const getCurrentStreamFor = async (user: string) => {
  const userKey = `user_${user}`;

  return new Promise<string | null>((resolve, reject) => {
    client.get(userKey, (err, stream) => {
      if (err) {
        return reject(err);
      }

      resolve(stream);
    });
  });
};

export const setCurrentStreamFor = async (participant: IParticipant) => {
  const { id, stream } = participant;

  const userKey = `user_${id}`;

  return new Promise<void>((resolve, reject) => {
    client.set(userKey, stream, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

export const getRoleFor = async (
  user: string,
  stream: string
): Promise<Roles> => {
  const streamKey = `stream_${stream}`;

  return new Promise((resolve, reject) => {
    client.hget(streamKey, user, (err, role) => {
      if (err) {
        return reject(err);
      }

      resolve(role as Roles);
    });
  });
};
