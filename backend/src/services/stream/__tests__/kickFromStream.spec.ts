import { ParticipantDAL } from "@backend/dal";
import { MessageService } from "@backend/services";
import { BroadcastService } from "@backend/services/broadcast";
import { createParticipantFixture } from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";
import { StreamService } from "../index";

describe("StreamService.kickFromStream", () => {
  const streamerId = "test-streamer-id";
  const userIdToKick = "test-user-id";
  const node = "test-node";

  const streamParticipants = [
    createParticipantFixture({ id: "id1" }),
    createParticipantFixture({ id: "id2" }),
    createParticipantFixture({ id: "id3" }),
  ];

  const streamParticipantIds = streamParticipants.map((p) => p.id);

  it("requests media server to remote user's media streams", async () => {
    await StreamService.kickFromStream({
      user: streamerId,
      userToKick: userIdToKick,
    });

    expect(mocked(MessageService).kickUser).toBeCalledWith(node, userIdToKick);
  });

  it("updates isBanned field on the participant model", async () => {
    await StreamService.kickFromStream({
      user: streamerId,
      userToKick: userIdToKick,
    });

    expect(mocked(ParticipantDAL).setBanStatus).toBeCalledWith(
      userIdToKick,
      true
    );
  });

  it("broadcasts kicked user to other participants", async () => {
    await StreamService.kickFromStream({
      user: streamerId,
      userToKick: userIdToKick,
    });

    expect(mocked(BroadcastService).broadcastKickedUser).toBeCalledWith({
      user: userIdToKick,
      ids: streamParticipantIds,
    });
  });
});
