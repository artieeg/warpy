import { StreamService } from "../index";
import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { mocked } from "ts-jest/utils";
import { BroadcastService } from "@backend/services/broadcast";

describe("StreamService.removeUser", () => {
  const mockedParticipantDAL = mocked(ParticipantDAL);
  const mockedStreamDAL = mocked(StreamDAL);
  const mockedBroadcastService = mocked(BroadcastService);
  const user = "user-id";

  it.todo("deletes the user");

  it("broadcasts user leave event", async () => {
    const stream = "test-stream";
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValue(stream);

    await StreamService.removeUser(user);

    expect(mockedBroadcastService.broadcastParticipantLeft).toBeCalledWith(
      user,
      stream
    );
  });
});
