import { BlockDAO } from "@backend/dal";

export const BlockService = {
  async blockUser(blocker: string, blocked: string) {
    const blockId = await BlockDAO.create({
      blocker,
      blocked,
    });

    return blockId;
  },
};
