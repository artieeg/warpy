import { Roles, IParticipant, Participant, IBaseUser } from "@warpy/lib";
import redis from "redis";
import { MessageService, UserService } from ".";
import { IRequestViewers, MessageHandler } from "@warpy/lib";
import { User } from "@backend/models";

const URL = process.env.PARTICIPANTS_CACHE || "redis://127.0.0.1:6375/5";

const client = redis.createClient({
  url: URL,
});

export const init = async () => {};

export const getUserWithRaisedHandsIds = (stream: string) => {
  const key = `raised_hands_${stream}`;

  return new Promise<string[]>((resolve, reject) => {
    client.smembers(key, (err, ids) => {
      if (err) {
        reject(err);
      } else {
        resolve(ids);
      }
    });
  });
};

export const unsetRaiseHand = (user: string, stream: string) => {
  const key = `raised_hands_${stream}`;

  return new Promise<void>((resolve, reject) => {
    client.srem(key, user, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const setRaiseHand = (user: string, stream: string) => {
  const key = `raised_hands_${stream}`;

  return new Promise<void>((resolve, reject) => {
    client.sadd(key, user, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const addParticipant = async (
  user: string,
  stream: string,
  role: Roles = "viewer"
) => {
  const streamKey = `stream_${stream}`;
  const participantKey = `user_${user}`;

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

export const setCurrentStreamFor = async (id: string, stream: string) => {
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

export const getSpeakersWithRoles = async (stream: string) => {
  const participants = await getStreamParticipantsWithRoles(stream);

  const speakers: Record<string, Roles> = {};

  for (const id in participants) {
    if (participants[id] === "speaker" || participants[id] === "streamer") {
      speakers[id] = participants[id] as Roles;
    }
  }

  return speakers;
};

const PARTICIPANTS_PER_PAGE = 50;
export const getViewersPage = async (
  stream: string,
  page: number
): Promise<Participant[]> => {
  const allStreamParticipants = await getStreamParticipantsWithRoles(stream);
  const allParticipantIds = Object.keys(allStreamParticipants);

  const viewerIds = [];

  const start = page * PARTICIPANTS_PER_PAGE;
  const end =
    allParticipantIds.length > start + PARTICIPANTS_PER_PAGE
      ? start + PARTICIPANTS_PER_PAGE
      : allParticipantIds.length;

  for (let i = start; i < end; i++) {
    const id = allParticipantIds[i];

    if (allStreamParticipants[id] === "viewer") {
      viewerIds.push(id);
    }
  }

  const users = await User.findByIds(viewerIds);

  const viewers: IParticipant[] = users.map((user) =>
    Participant.fromUser(user, allStreamParticipants[user.id] as Roles, stream)
  );

  return viewers;
};

export const getParticipantsCount = async (stream: string) => {
  const participants = await getStreamParticipants(stream);

  return participants.length;
};

export const getUsersWithRaisedHands = async (
  stream: string
): Promise<IParticipant[]> => {
  const ids = await getUserWithRaisedHandsIds(stream);

  const users = await User.findByIds(ids);

  return users.map((data) => Participant.fromUser(data, "viewer", stream));
};

export const getSpeakers = async (stream: string): Promise<IParticipant[]> => {
  const speakersWithRoles = await getSpeakersWithRoles(stream);
  const speakerIds = Object.keys(speakersWithRoles);

  const speakersInfo = await User.findByIds(speakerIds);

  return speakersInfo.map((data) =>
    Participant.fromUser(data, speakersWithRoles[data.id], stream)
  );
};

export const broadcastNewSpeaker = async (speaker: IParticipant) => {
  const { stream } = speaker;

  const users = await getStreamParticipants(stream);

  await MessageService.sendMessageBroadcast(users, {
    event: "new-speaker",
    data: {
      speaker,
      stream,
    },
  });
};

export const broadcastRaiseHand = async (viewer: IParticipant) => {
  const stream = await getCurrentStreamFor(viewer.id);

  if (!stream) {
    return;
  }

  const users = await getStreamParticipants(stream);

  await MessageService.sendMessageBroadcast(users, {
    event: "raise-hand",
    data: {
      viewer,
      stream,
    },
  });
};

export const broadcastParticipantLeft = async (
  user: string,
  stream: string
) => {
  const users = await getStreamParticipants(stream);

  await MessageService.sendMessageBroadcast(users, {
    event: "user-left",
    data: {
      user,
      stream,
    },
  });
};

export const broadcastNewViewer = async (viewer: IParticipant) => {
  const { stream } = viewer;
  const participants = await getStreamParticipants(stream);

  await MessageService.sendMessageBroadcast(participants, {
    event: "new-viewer",
    data: {
      stream,
      viewer,
    },
  });
};
