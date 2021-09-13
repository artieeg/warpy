import { UserDAO } from "@backend/dal";
import { CacheService } from "./cache";

const cachedGetUserById = CacheService.withCache(UserDAO.findById);

export const ChatService = {
  broadcastNewMessage: (user: string, message: string) => {},
};
