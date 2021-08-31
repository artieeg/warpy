import { StreamService } from "../index";
import { ParticipantDAL } from "@backend/dal";
import { mocked } from "ts-jest/utils";
import { BroadcastService } from "@backend/services/broadcast";

describe("StreamService.removeUser", () => {
  const mockedParticipantDAL = mocked(ParticipantDAL);
  const mockedBroadcastService = mocked(BroadcastService);
  const user = "user-id";

  it("broadcasts user leave event", async () => {
    const stream = "test-stream";
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValue(stream);

    await StreamService.removeUserFromStreams(user);

    expect(mockedBroadcastService.broadcastParticipantLeft).toBeCalledWith(
      user,
      stream
    );
  });
});
