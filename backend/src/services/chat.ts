import { ParticipantDAL, UserDAO } from "@backend/dal";
import { CacheService } from "./cache";
import Filter from "bad-words";
import { MINUTES_5, SECONDS_30 } from "@backend/constants";
import { BroadcastService } from "./broadcast";

const cachedFindUser = CacheService.withCache(UserDAO.findById, {
  keyExtractor: ([id]) => id,
  prefix: "user",
  expiry: MINUTES_5,
});

const cachedGetCurrentStreamFor = CacheService.withCache(
  ParticipantDAL.getCurrentStreamFor,
  {
    keyExtractor: ([user]) => user,
    prefix: "current_stream",
    expiry: MINUTES_5,
  }
);

const cachedGetParticipantsByStream = CacheService.withCache(
  ParticipantDAL.getByStream,
  {
    keyExtractor: ([streamId]) => streamId,
    prefix: "stream_participants",
    expiry: SECONDS_30,
  }
);

const profanityFilter = new Filter();

const getFilteredMessage = (message: string): string => {
  return profanityFilter.clean(message);
};

const broadcastNewMessage = async (
  user_id: string,
  unfilteredMessage: string
) => {
  const user = await cachedFindUser(user_id);

  if (!user) {
    throw new Error("User not found");
  }

  const filteredMessage = getFilteredMessage(unfilteredMessage);

  const stream = await cachedGetCurrentStreamFor(user_id);

  if (!stream) {
    throw new Error("Not a stream participant");
  }

  const participants = await cachedGetParticipantsByStream(stream);
  const ids = participants.map((participant) => participant.id);

  BroadcastService.broadcastNewMessage({
    targetUserIds: ids,
    message: {
      sender: user,
      message: filteredMessage,
      timestamp: Date.now(),
    },
  });
};

export const ChatService = {
  broadcastNewMessage,
};
