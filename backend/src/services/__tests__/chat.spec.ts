import { ParticipantDAL, UserDAO } from "@backend/dal";
import {
  createParticipantFixture,
  createUserFixture,
} from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";
import { BroadcastService } from "../broadcast";
import { CacheService } from "../cache";

mocked(CacheService).withCache.mockImplementation(
  (fn: any, _params: any) => fn
);

import { ChatService } from "../chat";

describe("ChatService", () => {
  const sender = "test sender";
  const text = "test message";
  const stream = "stream";
  const streamParticipantIds = [sender, "test1", "test2"];
  const senderUserData = createUserFixture({ id: sender });

  beforeEach(() => {
    mocked(UserDAO.findById).mockResolvedValue(senderUserData);
    mocked(ParticipantDAL.getCurrentStreamFor).mockResolvedValue(stream);
    mocked(ParticipantDAL.getByStream).mockResolvedValue(
      streamParticipantIds.map((id) => createParticipantFixture({ id }))
    );
  });

  it("does not broadcast if the stream does not exist", async () => {
    mocked(ParticipantDAL.getCurrentStreamFor).mockResolvedValueOnce(null);
    expect(ChatService.broadcastNewMessage(sender, text)).rejects.toBeTruthy();
  });

  it("does not broadcast if the sender does not exist", async () => {
    mocked(UserDAO.findById).mockResolvedValueOnce(null);
    expect(ChatService.broadcastNewMessage(sender, text)).rejects.toBeTruthy();
  });

  it("broadcasts new message", async () => {
    await ChatService.broadcastNewMessage(sender, text);

    expect(BroadcastService.broadcastNewMessage).toBeCalledWith(
      expect.objectContaining({
        targetUserIds: streamParticipantIds,
      })
    );
  });
});
