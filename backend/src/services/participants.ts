import { IBaseParticipant, IParticipant, Participant } from "@app/models";
import { Roles } from "@app/types";
import redis from "redis";
import { MessageService, UserService } from ".";

const URL = process.env.PARTICIPANTS_CACHE || "redis://127.0.0.1:6375/5";

const client = redis.createClient({
  url: URL,
});

export const init = async () => {};

export const addParticipant = async (participant: IBaseParticipant) => {
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

export const removeParticipant = async (user: string, stream: string) => {
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

export const getStreamParticipantsWithRoles = async (streamId: string) => {
  const streamKey = `stream_${streamId}`;

  return new Promise<Record<string, string>>((resolve, reject) => {
    client.hgetall(streamKey, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
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

export const setCurrentStreamFor = async (participant: IBaseParticipant) => {
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

const PARTICIPANTS_PER_PAGE = 50;
export const handleParticipantsRequest = async (
  user: string,
  stream: string,
  page: number
) => {
  const allStreamParticipants = await getStreamParticipantsWithRoles(stream);
  const allParticipantIds = Object.keys(allStreamParticipants);

  const participantIds = [];

  const start = page * PARTICIPANTS_PER_PAGE;
  const end =
    allParticipantIds.length > start + PARTICIPANTS_PER_PAGE
      ? start + PARTICIPANTS_PER_PAGE
      : allParticipantIds.length;

  for (let i = start; i < end; i++) {
    const id = allParticipantIds[i];

    if (id !== user) {
      participantIds.push(id);
    }
  }

  const users = await UserService.getUsersByIds(participantIds);

  const participants: IParticipant[] = users.map((user) =>
    Participant.fromUser(user, allStreamParticipants[user.id] as Roles, stream)
  );

  MessageService.sendMessage(user, {
    event: "participants-page",
    body: {
      page,
      participants,
    },
  });
};
