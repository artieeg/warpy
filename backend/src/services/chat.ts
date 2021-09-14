import { UserDAO } from "@backend/dal";
import { CacheService } from "./cache";
import Filter from "bad-words";

const cachedFindUser = CacheService.withCache(UserDAO.findById, {
  keyExtractor: ([id]) => id,
  prefix: "user",
  expiry: 120,
});

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

  //TODO: broadcast
};

export const ChatService = {
  broadcastNewMessage,
};
